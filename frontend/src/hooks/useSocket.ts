import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/useAuthStore'

let socketInstance: Socket | null = null

export function useSocket() {
  const { accessToken } = useAuthStore()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!accessToken) return

    if (!socketInstance) {
      socketInstance = io(`${import.meta.env.VITE_SOCKET_URL}/chat`, {
        auth: { token: accessToken },
        transports: ['websocket'],
      })
    }

    socketRef.current = socketInstance

    return () => {
      // Ne pas déconnecter — socket partagé
    }
  }, [accessToken])

  return socketRef.current
}
