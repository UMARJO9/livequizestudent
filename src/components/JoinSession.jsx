import { useState } from 'react'

function JoinSession({ onJoin, error, isConnecting }) {
  const [step, setStep] = useState(1)
  const [sessionCode, setSessionCode] = useState('')
  const [name, setName] = useState('')

  const handleCodeSubmit = (e) => {
    e.preventDefault()
    if (sessionCode.trim()) {
      setStep(2)
    }
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) {
      onJoin(sessionCode.toUpperCase(), name.trim())
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  return (
    <div className="join-session">
      <div className="join-card">
        <h1 className="join-title">Live Quiz</h1>

        {step === 1 && (
          <form onSubmit={handleCodeSubmit} className="join-form">
            <h2>Введите код сессии</h2>
            <input
              type="text"
              value={sessionCode}
              onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
              placeholder="Например: AB12"
              className="input-field"
              maxLength={10}
              autoFocus
            />
            <button type="submit" className="btn btn-primary" disabled={!sessionCode.trim()}>
              Далее
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNameSubmit} className="join-form">
            <h2>Как вас зовут?</h2>
            <p className="session-info">Код сессии: <strong>{sessionCode}</strong></p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите ваше имя"
              className="input-field"
              maxLength={30}
              autoFocus
              disabled={isConnecting}
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button type="button" className="btn btn-secondary" onClick={handleBack} disabled={isConnecting}>
                Назад
              </button>
              <button type="submit" className="btn btn-primary" disabled={!name.trim() || isConnecting}>
                {isConnecting ? 'Подключение...' : 'Присоединиться'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default JoinSession
