function Results({ results, playerName, onPlayAgain }) {
  const playerResult = results.scoreboard?.find(
    (player) => player.name === playerName
  )

  const isWinner = results.winners?.some((w) => w.name === playerName)

  return (
    <div className="results">
      <div className="results-card">
        <h1 className="results-title">
          {isWinner ? '🏆 Поздравляем!' : 'Викторина завершена!'}
        </h1>

        {playerResult && (
          <div className="player-result">
            <div className="position">#{playerResult.position}</div>
            <div className="player-score">
              <span className="player-name">{playerName}</span>
              <span className="score">{playerResult.score} очков</span>
            </div>
          </div>
        )}

        <div className="scoreboard">
          <h2>Таблица лидеров</h2>
          <div className="scoreboard-list">
            {results.scoreboard?.map((player, index) => (
              <div
                key={index}
                className={`scoreboard-item ${player.name === playerName ? 'highlight' : ''}`}
              >
                <span className="position">
                  {player.position === 1 && '🥇'}
                  {player.position === 2 && '🥈'}
                  {player.position === 3 && '🥉'}
                  {player.position > 3 && `#${player.position}`}
                </span>
                <span className="name">{player.name}</span>
                <span className="score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={onPlayAgain}>
          Играть снова
        </button>
      </div>
    </div>
  )
}

export default Results
