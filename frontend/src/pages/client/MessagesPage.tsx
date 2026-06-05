import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'
import api from '@/services/api'
import { useAuthStore } from '@/stores/useAuthStore'
import { useChatStore } from '@/stores/useChatStore'
import type { Conversation, Message } from '@/types'

const time = (d: string) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

export default function MessagesPage() {
  const { user } = useAuthStore()
  const { socket, setActiveConversation, resetUnread } = useChatStore()
  const [conv, setConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scrollDown = () => setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)

  // Récupère / crée la conversation support du client + ses messages
  useEffect(() => {
    let convId = ''
    api.post<Conversation>('/conversations', { subject: 'Conversation avec LUNARIA' })
      .then((r) => {
        setConv(r.data)
        convId = r.data._id
        return api.get<{ data: Message[] }>(`/conversations/${convId}/messages`)
      })
      .then((r) => { setMessages(r.data.data); scrollDown() })
      .catch(() => {})
    return () => { if (convId) setActiveConversation(null) }
  }, [])

  // Rejoint la room + écoute les messages temps réel
  useEffect(() => {
    if (!socket || !conv) return
    socket.emit('join_conversation', { conversationId: conv._id })
    setActiveConversation(conv._id)
    resetUnread()

    const onNew = (m: Message) => {
      setMessages((prev) => {
        if (prev.some((x) => x._id === m._id)) return prev
        // remplace un éventuel message optimiste (temp-) correspondant
        const cleaned = prev.filter((x) => !(String(x._id).startsWith('temp-') && x.content === m.content && String(x.sender?._id) === String(m.sender?._id)))
        return [...cleaned, m]
      })
      // si le message vient de l'agent, on le marque lu (on est dans la fenêtre)
      socket.emit('mark_read', { conversationId: conv._id })
      scrollDown()
    }
    const onTyping = (d: { role?: string }) => {
      if (d.role === 'ADMIN') { setTyping(true); setTimeout(() => setTyping(false), 2500) }
    }
    // L'agent a lu → on recharge pour refléter readBy ("Vu")
    const onSeen = () => {
      api.get<{ data: Message[] }>(`/conversations/${conv._id}/messages`).then((r) => setMessages(r.data.data)).catch(() => {})
    }
    socket.on('new_message', onNew)
    socket.on('user_typing', onTyping)
    socket.on('message_seen', onSeen)
    return () => { socket.off('new_message', onNew); socket.off('user_typing', onTyping); socket.off('message_seen', onSeen) }
  }, [socket, conv])

  const send = () => {
    if (!text.trim() || !conv) return
    const content = text.trim()
    setText('')
    // 1) Affichage OPTIMISTE immédiat (le message apparaît tout de suite)
    const tempId = 'temp-' + Date.now()
    const optimistic = {
      _id: tempId,
      conversation: conv._id,
      sender: { _id: user?._id, firstName: user?.firstName, lastName: user?.lastName, role: user?.role },
      type: 'TEXT',
      content,
      readBy: [String(user?._id)],
      isDeleted: false,
      createdAt: new Date().toISOString(),
    } as unknown as Message
    setMessages((prev) => [...prev, optimistic])
    scrollDown()
    // 2) Envoi via socket ; l'ack remplace le message temporaire par le vrai
    socket?.emit('send_message', { conversationId: conv._id, content }, (msg: Message) => {
      if (msg && msg._id) {
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m._id !== tempId)
          return withoutTemp.some((m) => m._id === msg._id) ? withoutTemp : [...withoutTemp, msg]
        })
      }
    })
  }

  const onType = () => {
    if (!socket || !conv) return
    socket.emit('typing', { conversationId: conv._id })
    if (typingTimer.current) clearTimeout(typingTimer.current)
  }

  const agentName = conv?.agent ? `${conv.agent.firstName} ${conv.agent.lastName}` : 'Conseillère LUNARIA'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 56px' }}>
      <div style={{ marginBottom: 18 }}>
        <div className="eyebrow">Messagerie</div>
        <h1 className="display" style={{ fontSize: 40, margin: '8px 0 0' }}>Discuter avec LUNARIA</h1>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 600, overflow: 'hidden', boxShadow: 'var(--sh-md)' }}>
        {/* En-tête : nom de l'agent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', borderBottom: '1px solid var(--line-2)' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral)', fontWeight: 700 }}>
            {agentName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{agentName}</div>
            <div style={{ fontSize: 12.5, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3ec47a' }} /> En ligne · répond en ~5 min
            </div>
          </div>
        </div>

        {/* Fil */}
        <div style={{ flex: 1, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--ivory)', overflowY: 'auto' }}>
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted-2)', fontSize: 13.5, margin: 'auto' }}>
              Envoyez un message, notre équipe vous répond rapidement ✨
            </div>
          )}
          {messages.map((m) => {
            const mine = m.sender?.role !== 'ADMIN'
            return (
              <div key={m._id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '74%' }}>
                {!mine && <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 3, marginLeft: 4 }}>{m.sender?.firstName} {m.sender?.lastName}</div>}
                <div style={{
                  background: mine ? 'var(--coral)' : 'var(--paper)', color: mine ? '#fff' : 'var(--ink)',
                  border: mine ? 'none' : '1px solid var(--line-2)', borderRadius: 16,
                  borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4,
                  padding: '11px 15px', fontSize: 14.5, lineHeight: 1.5, boxShadow: 'var(--sh-sm)' }}>
                  {m.content}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--muted-2)', marginTop: 3, textAlign: mine ? 'right' : 'left', display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start', gap: 6 }}>
                  {mine && (() => {
                    const seen = m.readBy?.some((id) => String(id) !== String(user?._id))
                    return <span style={{ color: seen ? '#2c9c5e' : 'var(--muted-2)', fontWeight: 700 }}>{seen ? 'Vu' : 'Envoyé'}</span>
                  })()}
                  <span>{time(m.createdAt)}</span>
                </div>
              </div>
            )
          })}
          {typing && (
            <div style={{ alignSelf: 'flex-start', background: 'var(--paper)', border: '1px solid var(--line-2)', borderRadius: 16, padding: '12px 16px', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map((i) => <span key={i} className="lun-typing-dot" style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Saisie */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderTop: '1px solid var(--line-2)' }}>
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); onType() }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Écrivez un message…"
            style={{ flex: 1, padding: '12px 18px', borderRadius: 'var(--r-pill)', background: 'var(--ivory)', border: '1px solid var(--line)', fontSize: 14, outline: 'none' }}
          />
          <button onClick={send} disabled={!text.trim()}
            style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: text.trim() ? 1 : .5 }}>
            <Icon name="send" size={18} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        .lun-typing-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted-2); display: inline-block; animation: lunBlink 1s infinite; }
        @keyframes lunBlink { 0%,100% { opacity: .3; transform: translateY(0) } 50% { opacity: 1; transform: translateY(-3px) } }
      `}</style>
    </div>
  )
}
