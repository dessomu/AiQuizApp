import React, { useContext } from "react";
import "./result.css";
import { motion } from "framer-motion";
import UseContext from "../../context/UseContext";

function ResultCard({ score, totalQuestions, topic }) {
  const { setShowResult, setQuestions, setQuizStarted, setTopic } =
    useContext(UseContext);

  const percentage = !score ? 0 : Math.round((score / totalQuestions) * 100);
  const angle = (percentage / 100) * 360;

  function handleStartNewQuiz() {
    setShowResult(false);
    setQuestions([]);
    setQuizStarted(false);
    setTopic("")
  }

  return (
    <div className="result-container">
      <div className="result-card">
        <h1 className="result-title">Quiz Results</h1>
        <p className="result-topic">Topic: {topic}</p>
        {/* Circular Progress */}
        <div
          className="ring-container"
          style={{
            position: "relative",
            backgroundColor: "rgb(247, 232, 232)",
            background: `conic-gradient(
            #5483ef ${angle}deg,    /* Accent color */
rgb(247, 232, 232) ${angle}deg
          )`,
          }}
        >
          <p
            style={{
              display: !score ? "block" : "none",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#5483ef",
              position: "absolute",
              top: "0",
              left: "45%",
            }}
          ></p>
          <div className="ring">
            <span className="percentage-text">{percentage}%</span>
          </div>
        </div>
        <h2 className="encouragement">
          {percentage === 100
            ? "Awesome ⭐️🎉 Keep it up 🏆 "
            : "Keep learning! You will improve with practice."}
        </h2>
        <p className="score-text">
          You answered {score} out of {totalQuestions} questions correctly.
        </p>
         {/* Analysis Box  */}
        <div className="analysis-box">
          <span>Analysis: </span>
          <p>
            {percentage === 100
              ? "Great job, keep learning, keep growing. 🌟👍"
              : `This quiz indicates there is room for improvement in your
            knowledge about ${topic}. Consider revisiting the fundamentals.`}
          </p>
        </div>
        <motion.button
          onClick={handleStartNewQuiz}
          whileHover={{ y: -2 }}
          className="start-quiz-btn"
        >
          Start a New Quiz
        </motion.button>
      </div>
    </div>
  );
}

export default ResultCard;
