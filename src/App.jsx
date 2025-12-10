import { useState, useEffect } from 'react'
import { socket, connectSocket, joinSession, sendAnswer, leaveSession } from './services/socket'
import JoinSession from './components/JoinSession'
import WaitingRoom from './components/WaitingRoom'
import Quiz from './components/Quiz'
import Results from './components/Results'
import './App.css'
import StudentJoinPage from "./StudentJoinPage";

const SCREENS = {
  JOIN: 'join',
  WAITING: 'waiting',
  QUIZ: 'quiz',
  RESULTS: 'results',
}

function App() {
  const [screen, setScreen] = useState(SCREENS.JOIN)
  const [sessionId, setSessionId] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [score, setScore] = useState(0)

  const [results, setResults] = useState(null)
  const [timerExpired, setTimerExpired] = useState(false)

  useEffect(() => {
    connectSocket()

    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('student:joined', (data) => {
      console.log('Joined session:', data)
      setIsConnecting(false)
      setError('')
      setScreen(SCREENS.WAITING)
    })

    socket.on('session:question', (data) => {
      console.log('New question:', data)
      setCurrentQuestion(data)
      setAnswered(false)
      setAnswerResult(null)
      setTimerExpired(false)
      setScreen(SCREENS.QUIZ)
    })

    socket.on('session:timer_expired', (data) => {
      console.log('Timer expired:', data)
      setTimerExpired(true)
      setAnswered(true)
    })

    socket.on('student:answer_received', (data) => {
      console.log('Answer received:', data)
    })

    socket.on('answer_result', (data) => {
      console.log('Answer result:', data)
      setAnswerResult(data)
      setScore(data.score_total)
    })

    socket.on('session:question_closed', (data) => {
      console.log('Question closed:', data)
    })

    socket.on('quiz_finished', (data) => {
      console.log('Quiz finished:', data)
      setResults(data)
      setScreen(SCREENS.RESULTS)
    })

    socket.on('error', (data) => {
      console.error('Error:', data.message)
      setError(data.message)
      setIsConnecting(false)
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    return () => {
      socket.off('connect')
      socket.off('student:joined')
      socket.off('session:question')
      socket.off('session:timer_expired')
      socket.off('student:answer_received')
      socket.off('answer_result')
      socket.off('session:question_closed')
      socket.off('quiz_finished')
      socket.off('error')
      socket.off('disconnect')
    }
  }, [])

  const handleJoin = (code, name) => {
    setSessionId(code)
    setPlayerName(name)
    setError('')
    setIsConnecting(true)
    joinSession(code, name)
  }

  const handleAnswer = (optionId) => {
    setAnswered(true)
    sendAnswer(sessionId, optionId)
  }

  const handlePlayAgain = () => {
    leaveSession(sessionId)
    setScreen(SCREENS.JOIN)
    setSessionId('')
    setPlayerName('')
    setCurrentQuestion(null)
    setAnswered(false)
    setAnswerResult(null)
    setTimerExpired(false)
    setScore(0)
    setResults(null)
    setError('')
  }

  return (
    <div className="app">
      {screen === SCREENS.JOIN && (
        <JoinSession
          onJoin={handleJoin}
          error={error}
          isConnecting={isConnecting}
        />
      )}

      {screen === SCREENS.WAITING && (
        <WaitingRoom
          sessionId={sessionId}
          playerName={playerName}
        />
      )}

      {screen === SCREENS.QUIZ && currentQuestion && (
        <Quiz
          question={currentQuestion}
          onAnswer={handleAnswer}
          answered={answered}
          answerResult={answerResult}
          timerExpired={timerExpired}
          score={score}
        />
      )}

      {screen === SCREENS.RESULTS && results && (
        <Results
          results={results}
          playerName={playerName}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  )
}

export default App
