import { useState, useEffect, useRef } from 'react'

function Quiz({ question, onAnswer, answered, answerResult, timerExpired, score }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(question?.time || 20)
  const timerRef = useRef(null)

  // Сброс состояния только при смене вопроса
  useEffect(() => {
    setSelectedOption(null)
    setTimeLeft(question?.time || 20)
  }, [question?.id])

  // Управление таймером
  useEffect(() => {
    // Очищаем предыдущий таймер
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Не запускаем таймер если время вышло (от сервера)
    if (timerExpired) return

    // Запускаем новый таймер
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [question?.id, timerExpired])

  const handleOptionClick = (optionId) => {
    if (answered || timeLeft <= 0 || timerExpired) return
    setSelectedOption(optionId)
    onAnswer(optionId)
  }

  const isDisabled = answered || timeLeft <= 0 || timerExpired

  const getOptionClass = (optionId) => {
    let className = 'option-btn'

    if (answerResult) {
      if (optionId === answerResult.correct_option) {
        className += ' correct'
      } else if (optionId === selectedOption && !answerResult.correct) {
        className += ' incorrect'
      }
    } else if (selectedOption === optionId) {
      className += ' selected'
    }

    return className
  }

  const timerClass = timeLeft <= 5 ? 'timer danger' : 'timer'

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="score-display">
          Очки: <strong>{score}</strong>
        </div>
        <div className={timerClass}>
          {timeLeft}с
        </div>
      </div>

      <div className="question-card">
        <h2 className="question-text">{question.text}</h2>

        <div className="options-grid">
          {question.options.map((option, index) => (
            <button
              key={option.id}
              className={getOptionClass(option.id)}
              onClick={() => handleOptionClick(option.id)}
              disabled={isDisabled}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>

        {timerExpired && !answerResult && (
          <div className="timer-expired-message">
            <p>⏰ Время вышло!</p>
            <div className="loader small"></div>
            <p className="waiting-text">Ожидание результата...</p>
          </div>
        )}

        {answered && !timerExpired && !answerResult && (
          <div className="waiting-result">
            <div className="loader small"></div>
            <p>Ожидание результата...</p>
          </div>
        )}

        {answerResult && (
          <div className={`result-message ${answerResult.correct ? 'correct' : 'incorrect'}`}>
            {answerResult.correct ? (
              <p>Правильно! +{answerResult.score_delta} очков</p>
            ) : (
              <p>
                {answerResult.your_answer === null
                  ? 'Время вышло!'
                  : 'Неправильно!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz
