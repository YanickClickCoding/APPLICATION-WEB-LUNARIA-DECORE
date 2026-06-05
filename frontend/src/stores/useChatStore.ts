import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface ChatNotif {
  conversationId: string
  preview: string
  from: 'agent' | 'client'
}

interface ChatState {
  socket: Socket | null
  unreadTotal: number
  /** id de la conversation actuellement ouverte (pour ne pas badger soi-même) */
  activeConversation: string | null
  connect: (token: string) => void
  disconnect: () => void
  setUnreadTotal: (n: number) => void
  incrementUnread: () => void
  resetUnread: () => void
  setActiveConversation: (id: string | null) => void
  onNotif: ((n: ChatNotif) => void) | null
  setOnNotif: (cb: ((n: ChatNotif) => void) | null) => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  socket: null,
  unreadTotal: 0,
  activeConversation: null,
  onNotif: null,

  connect: (token) => {
    if (get().socket) return
    const socket = io(`${import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'}/chat`, {
      auth: { token },
      transports: ['websocket'],
    })

    // Notification globale (pastille) — reçue même hors de la fenêtre de chat
    socket.on('message_notification', (notif: ChatNotif) => {
      // Si on est déjà dans cette conversation, ne pas incrémenter
      if (get().activeConversation !== notif.conversationId) {
        set((s) => ({ unreadTotal: s.unreadTotal + 1 }))
      }
      get().onNotif?.(notif)
    })

    set({ socket })
  },

  disconnect: () => {
    get().socket?.disconnect()
    set({ socket: null, unreadTotal: 0, activeConversation: null })
  },

  setUnreadTotal: (n) => set({ unreadTotal: n }),
  incrementUnread: () => set((s) => ({ unreadTotal: s.unreadTotal + 1 })),
  resetUnread: () => set({ unreadTotal: 0 }),
  setActiveConversation: (id) => set({ activeConversation: id }),
  setOnNotif: (cb) => set({ onNotif: cb }),
}))
