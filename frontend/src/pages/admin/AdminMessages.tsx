import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import { useChatPresenceStore } from '@/stores/useChatPresenceStore'
import type { Conversation, Message } from '@/types'

const time = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })


export default function AdminMessages() {
  const { user } = useAuthStore()
  const { socket, setActiveConversation, resetUnread } = useChatStore()
  const { onlineMap, setOnline } = useChatPresenceStore()

  const [convs, setConvs] = useState<Conversation[]>([])
  const [active, setActive] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)

  const loadConvs = () =>
    api.get<Conversation[]>('/conversations').then((r) => setConvs(r.data)).catch(() => {})

  useEffect(() => { loadConvs(); resetUnread() }, [])

  // Présence initiale : récupère la liste des utilisateurs déjà connectés
  useEffect(() => {
    if (!socket) return
    const seed = () => socket.emit('get_online_users', (ids: string[]) => {
      ;(ids ?? []).forEach((id) => setOnline(id, true))
    })
    if (socket.connected) seed()
    socket.on('connect', seed)
    return () => { socket.off('connect', seed) }
  }, [socket, setOnline])

  // Ouvre une conversation
  const open = (c: Conversation) => {
    setActive(c)
    setActiveConversation(c._id)
    api.get<{ data: Message[] }>(`/conversations/${c._id}/messages`).then((r) => { setMessages(r.data.data); scrollDown() })
    socket?.emit('join_conversation', { conversationId: c._id })
    // recharge la liste pour remettre à zéro le badge de cette conv
    setTimeout(loadConvs, 400)
  }

  // Temps réel
  useEffect(() => {
    if (!socket) return

    const onPresence = (d: { userId: string; isOnline: boolean }) => {
      setOnline(d.userId, d.isOnline)
    }

    const onNew = (m: Message) => {
      if (active && m.conversation === active._id) {
        setMessages((prev) => {
          if (prev.some((x) => x._id === m._id)) return prev
          const cleaned = prev.filter((x) => !(String(x._id).startsWith('temp-') && x.content === m.content && String(x.sender?._id) === String(m.sender?._id)))
          return [...cleaned, m]
        })
        socket.emit('mark_read', { conversationId: active._id })
        scrollDown()
      }
      loadConvs()
    }

    const onMessageSeen = (_d: { userId: string; conversationId: string }) => {
      // on recharge pour refléter readBy
      if (active) {
        api.get<{ data: Message[] }>(`/conversations/${active._id}/messages`).then((r) => setMessages(r.data.data)).catch(() => {})
      }
    }

    socket.on('user_presence', onPresence)
    socket.on('new_message', onNew)
    socket.on('message_notification', loadConvs)
    socket.on('message_seen', onMessageSeen)

    return () => {
      socket.off('user_presence', onPresence)
      socket.off('new_message', onNew)
      socket.off('message_notification', loadConvs)
      socket.off('message_seen', onMessageSeen)
    }
  }, [socket, active])


  const send = () => {
    if (!text.trim() || !active) return
    const content = text.trim()
    setText('')
    // 1) Affichage OPTIMISTE immédiat
    const tempId = 'temp-' + Date.now()
    const optimistic = {
      _id: tempId,
      conversation: active._id,
      sender: { _id: user?._id, firstName: user?.firstName, lastName: user?.lastName, role: user?.role },
      type: 'TEXT',
      content,
      readBy: [String(user?._id)],
      isDeleted: false,
      createdAt: new Date().toISOString(),
    } as unknown as Message
    setMessages((prev) => [...prev, optimistic])
    scrollDown()
    // 2) Source de vérité: REST (persiste côté backend)
    api.post<{ _id: string; content: string; conversation: string; sender: any; createdAt: string; readBy?: string[] }>(
      `/conversations/${active._id}/messages`,
      { content, type: 'TEXT' },
    )
      .then((r) => {
        const saved = r.data as unknown as Message
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m._id !== tempId)
          if (withoutTemp.some((m) => m._id === saved._id)) return withoutTemp
          return [...withoutTemp, saved]
        })
      })
      .catch(() => {
        // si l'envoi REST échoue, on retire le temp pour éviter le ghost
        setMessages((prev) => prev.filter((m) => m._id !== tempId))
      })
  }

  const clientName = (c: Conversation) => c.client ? `${c.client.firstName} ${c.client.lastName}` : 'Client'

  return (
    <div style={{ margin: -32 }}>
      <div style={{ display: 'flex', height: 'calc(100vh - 65px)', minHeight: 520, border: '1px solid var(--line-2)' }}>
        {/* Liste conversations */}
        <aside style={{ width: 320, borderRight: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', background: 'var(--paper)' }}>
          <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--line-2)' }}>
            <h1 className="display" style={{ fontSize: 28, margin: 0 }}>Messages</h1>
            <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{convs.length} conversation{convs.length > 1 ? 's' : ''}</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {convs.length === 0 && (
              <div style={{ padding: 28, textAlign: 'center', color: 'var(--muted-2)', fontSize: 13.5 }}>Aucune conversation pour le moment.</div>
            )}
            {convs.map((c) => (
              <button key={c._id} onClick={() => open(c)}
                style={{ width: '100%', textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center', padding: '14px 18px',
                  border: 'none', borderBottom: '1px solid var(--line-2)', cursor: 'pointer',
                  background: active?._id === c._id ? 'var(--coral-soft)' : 'transparent' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--night)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, position: 'relative' }}>
                  {clientName(c)[0]}
                  <span style={{
                    position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: '50%',
                    background: (c.client?._id && onlineMap[String(c.client._id)]) ? '#3ec47a' : 'var(--muted-2)',
                    boxShadow: '0 0 0 2px var(--paper)',
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{clientName(c)}</span>
                    {c.adminUnread > 0 && (
                      <span style={{ background: 'var(--coral)', color: '#fff', fontSize: 10.5, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', flexShrink: 0 }}>
                        {c.adminUnread}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 }}>
                    {c.lastMessage?.content ?? 'Nouvelle conversation'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Panneau de chat */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--ivory)' }}>
          {!active ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--muted-2)' }}>
              <Icon name="chat" size={48} color="var(--line)" />
              <div style={{ marginTop: 12, fontSize: 14 }}>Sélectionnez une conversation</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderBottom: '1px solid var(--line-2)', background: 'var(--paper)' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--night)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, position: 'relative' }}>
                  {clientName(active)[0]}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: (active.client?._id && onlineMap[String(active.client._id)]) ? '#3ec47a' : 'var(--muted-2)',
                      boxShadow: '0 0 0 2px var(--paper)',
                    }}
                    aria-label="Présence"
                  />
                </div>
                {(() => {
                  const online = !!(active.client?._id && onlineMap[String(active.client._id)])
                  return (
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{clientName(active)}</div>
                      <div style={{ fontSize: 12.5, color: online ? '#2c9c5e' : 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: online ? '#3ec47a' : 'var(--muted-2)' }} />
                        {online ? 'En ligne' : (active.client?.phone ?? 'Hors ligne')}
                      </div>
                    </div>
                  )
                })()}
              </div>


              <div style={{ flex: 1, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                {messages.map((m) => {
                  const mine = m.sender?.role === 'ADMIN'
                  // « Vu » UNIQUEMENT si le destinataire (le client) a ouvert/lu le message
                  const seenByClient = !!(active?.client?._id && (m.readBy ?? []).some((id) => String(id) === String(active.client!._id)))
                  return (
                    <div key={m._id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                      {!mine && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3, marginLeft: 4 }}>{m.sender?.firstName}</div>}
                      <div style={{ background: mine ? 'var(--coral)' : 'var(--paper)', color: mine ? '#fff' : 'var(--ink)',
                        border: mine ? 'none' : '1px solid var(--line-2)', borderRadius: 16,
                        borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4,
                        padding: '11px 15px', fontSize: 14.5, lineHeight: 1.5, boxShadow: 'var(--sh-sm)' }}>
                        {m.content}
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--muted-2)', marginTop: 3, textAlign: mine ? 'right' : 'left', display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', gap: 6 }}>
                        {mine && (
                          <span style={{ color: seenByClient ? '#2c9c5e' : 'var(--muted-2)', fontWeight: 700 }}>
                            {seenByClient ? '✓✓ Vu' : 'Envoyé'}
                          </span>
                        )}
                        <span>{time(m.createdAt)}</span>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderTop: '1px solid var(--line-2)', background: 'var(--paper)' }}>
                <input value={text} onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  aria-label={`Répondre à ${clientName(active)}`}
                  placeholder={`Répondre à ${clientName(active)}…`}
                  style={{ flex: 1, padding: '12px 18px', borderRadius: 'var(--r-pill)', background: 'var(--ivory)', border: '1px solid var(--line)', fontSize: 14, outline: 'none' }} />
                <button onClick={send} disabled={!text.trim()} aria-label="Envoyer le message"
                  style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: text.trim() ? 'pointer' : 'not-allowed', opacity: text.trim() ? 1 : .5 }}>
                  <Icon name="send" size={18} color="#fff" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
