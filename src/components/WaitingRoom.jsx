function WaitingRoom({ sessionId, playerName }) {
  return (
    <div className="waiting-room">
      <div className="waiting-card">
        <div className="loader"></div>
        <h1>Ожидание начала</h1>
        <p className="player-info">
          Вы присоединились как: <strong>{playerName}</strong>
        </p>
        <p className="session-info">
          Код сессии: <strong>{sessionId}</strong>
        </p>
        <p className="waiting-hint">Ожидайте, когда учитель начнёт викторину...</p>
      </div>
    </div>
  )
}

export default WaitingRoom
