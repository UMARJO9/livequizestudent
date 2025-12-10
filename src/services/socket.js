import { io } from 'socket.io-client'

const DEFAULT_PORT = 8000

const resolveSocketUrl = () => {
  const envUrl = import.meta.env?.VITE_SOCKET_URL

  if (envUrl && envUrl.trim()) {
    return envUrl.trim()
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location
    const httpProtocol = protocol === 'https:' ? 'https://' : 'http://'
    return `${httpProtocol}${hostname}:${DEFAULT_PORT}`
  }

  return `http://127.0.0.1:${DEFAULT_PORT}`
}

const SOCKET_URL = resolveSocketUrl()

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
})

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

export const joinSession = (sessionId, name) => {
  socket.emit('student:join', {
    session_id: sessionId,
    name: name,
  })
}

export const sendAnswer = (sessionId, optionId) => {
  socket.emit('student:answer', {
    session_id: sessionId,
    option_id: optionId,
  })
}

export const leaveSession = (sessionId) => {
  socket.emit('student:leave', {
    session_id: sessionId,
  })
}
