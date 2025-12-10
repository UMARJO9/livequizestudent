import { io } from 'socket.io-client'

const SOCKET_URL = 'http://127.0.0.1:8000'

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
