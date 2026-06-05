import { create } from 'zustand'

interface ChatPresenceState {
  /** userId -> isOnline */
  onlineMap: Record<string, boolean>
  setOnline: (userId: string, isOnline: boolean) => void
}

export const useChatPresenceStore = create<ChatPresenceState>((set) => ({
  onlineMap: {},
  setOnline: (userId, isOnline) => set((s) => ({ onlineMap: { ...s.onlineMap, [userId]: isOnline } })),
}))

