import { useState, useEffect } from 'react'

function Quiz({ question, onAnswer, answered, answerResult, score }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft] = useState(question?.time || 20)

  useEffect(() => {
    setSelectedOption(null)
    setTimeLeft(question?.time || 20)
  }, [question?.id])

  useEffect(() => {
    if (timeLeft <= 0 || answered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [question?.id, answered])

  const handleOptionClick = (optionId) => {
    if (answered || timeLeft <= 0) return
    setSelectedOption(optionId)
    onAnswer(optionId)
  }

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
              disabled={answered || timeLeft <= 0}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option.text}</span>
            </button>
          ))}
        </div>

        {answered && !answerResult && (
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
