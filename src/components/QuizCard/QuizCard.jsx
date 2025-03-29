import React, {  useState, useContext } from "react";
import "./card.css";
import { motion } from "framer-motion";
import ResultCard from "../ResultCard/ResultCard";
import UseContext from "../../context/UseContext";

function QuizCard({ questions, topic }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  //to handle visuals for right/wrong answer
  const [optionClicked, setOptionClicked] = useState(false);
  const [correct, setCorrect] = useState(false);

  //to display the answer after clicking an option
  const [answerIndex, setAnswerIndex] = useState(null);

  //to display result analysis
  const { showResult, setShowResult } = useContext(UseContext);

  const totalQuestions = questions.length;

  function handleAnswer(index) {
    setOptionClicked(true);
    const correctIndex = parseInt(questions[currentQuestion].correct); // Ensure it's a number
    setAnswerIndex(correctIndex);

    if (correctIndex === index) {
      setScore((prev) => prev + 1);
      setCorrect(true);
    }
  }

  function handleQuestion(e) {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
    if (
      currentQuestion === totalQuestions - 1 &&
      e.target.textContent === "View Score"
    ) {
      setShowResult(true);
    }
    setOptionClicked(false);
    setCorrect(false);
  }

  return (
    <>
      {showResult ? (
        <ResultCard
          score={score}
          totalQuestions={totalQuestions}
          topic={topic}
        />
      ) : (
        <div className="card-container">
          <div className="card">
            <div className="quiz-status">
              <span className="question-status">
                Question {currentQuestion + 1}/{totalQuestions}
              </span>
              <span
                style={{
                  display: optionClicked ? "block" : "none",
                  backgroundColor: correct ? "#d2eedc" : "#fee2e1",
                  color: correct ? "#238d4c" : "#a23737",
                }}
                className="answer-status"
              >
                {correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <h3 className="question">{questions[currentQuestion]?.question}</h3>
            <ul className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <li
                style={{
                  background:optionClicked && index === answerIndex?"#d2eedc":"none",
                  color:optionClicked && index === answerIndex?"#238d4c":"#475569",
                  border:optionClicked && index === answerIndex?"solid 1px #238d4c":" solid 1px rgba(0, 0, 0,0.1)",
                }}
                  onClick={optionClicked ? null : () => handleAnswer(index)}
                  key={index}
                  className="option"
                >
                  <span className="no">
                    {String.fromCharCode(97 + index).toUpperCase()}
                  </span>{" "}
                  <span style={{ textAlign: "left" }}>{option}</span>
                </li>
              ))}
            </ul>
            <div
              style={{ display: optionClicked ? "block" : "none" }}
              className="answer"
            >
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>
                Correct Answer:
              </p>
              <p>{questions[currentQuestion]?.options[answerIndex]}</p>
            </div>
            <motion.button
              onClick={(e) => handleQuestion(e)}
              whileHover={{ y: -2, opacity: 0.9 }}
              className="next"
            >
              {currentQuestion === totalQuestions - 1
                ? "View Score"
                : "Next Question"}
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}

export default QuizCard;
