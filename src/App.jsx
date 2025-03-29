import { useState, useContext } from "react";
import "./App.css";
import { motion } from "framer-motion";
import QuizCard from "./components/QuizCard/QuizCard";
import UseContext from "./context/UseContext";
import Lottie from "lottie-react";
import animationData from "./assets/Loader.json"

function App() {
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { topic, setTopic } = useContext(UseContext);
  const { questions, setQuestions } = useContext(UseContext);
  const { quizStarted, setQuizStarted } = useContext(UseContext);

  const apiKey = import.meta.env.VITE_API_KEY;
  

  async function generateQuiz() {
    if (!topic) return;

    setLoading(true);
    setError("");

    try {
      const prompt = `Generate ${numOfQuestions} quiz questions about ${topic} with 4 options and correct answer. Format as JSON array:
      [{
        question: "question text",
        options: ["a", "b", "c", "d"],
        correct: "index"
      }]`;

   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://freequickquizapp.netlify.app/", // Optional. Site URL for rankings on openrouter.ai.
          "X-Title": "qucickquiz", // Optional. Site title for rankings on openrouter.ai.
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [
            {
              "role": "user",
              "content": prompt,
            }
          ]
        })
      });

      const data = await response.json();
      const markdownText =
        data.choices?.[0]?.message?.content || "No response received.";

      function sanitizeJSON(responseText) {
        // Remove LaTeX boxed syntax
        responseText = responseText.replace(/\\boxed\{([\s\S]*?)\}/g, "$1");

        // Remove Markdown code block indicators (```json ... ```)
        responseText = responseText.replace(/```json|```/g, "").trim();

        // Try parsing the cleaned JSON
        try {
          return JSON.parse(responseText);
        } catch (error) {
          console.error("Invalid JSON data:", error);
          return null;
        }
      }

      // Usage:
      const cleanJson = sanitizeJSON(markdownText);
      // const jsonData = JSON.parse(cleanJson);

      setQuestions(cleanJson);
      setQuizStarted(true);
    } catch (error) {
      setError(`Error generating quiz, sorry for inconvenience`);
      console.log(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <main>
        <header>
          <h2 style={{ color: "#6891f1" }}>Quick</h2>
          <h2>Quiz</h2>
        </header>
        {!quizStarted ? (
          <div  className="container">
            <p className="heading" >Quick Quiz</p>
            <p className="sub-heading">
              Generate AI-powered quizzes on any topic
            </p>
            <div style={{background:loading?"#ffffff":"rgba(255, 255, 255, 0.15)",position:"relative"}} className="form">
              <h2>Create Your Quiz</h2>
              <p className="form-sub-heading">
                Choose a topic & let the AI test your knowledge
              </p>
              <label
                htmlFor="topic"
              >
                Quiz Topic
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                id="topic"
                type="text"
                placeholder="eg. Solar System, French Revolution..."
              />
              <label
                htmlFor="num"
              >
                Number of Questions
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  margin: "0 0 15px 0",
                }}
              >
                <input
                  style={{ width: "93%" }}
                  min="3"
                  max="20"
                  value={numOfQuestions}
                  onChange={(e) => setNumOfQuestions(e.target.value)}
                  type="range"
                  name="slider"
                  id="num"
                />{" "}
                <span style={{ fontSize: "large" }}>{numOfQuestions}</span>
              </div>
              <motion.button
                whileHover={{
                  backgroundColor: !topic ? "#6891f1" : "#3264d9",
                  y: !topic ? 0 : -2,
                  cursor: "pointer",
                }}
                transition={{ type: "spring", stiffness: 200 }}
                whileTap={{ backgroundColor: "#6891f1" }}
                onClick={generateQuiz}
              >
                Generate Quiz
              </motion.button>
              <p
                style={{
                  display: error !== "" ? "block" : "none",
                  color: "red",
                }}
              >
                {error}
              </p>
               {loading?(
                <div id="loader-container" >
                 <Lottie style={{width:"70%",aspectRatio:"167/100"}} animationData={animationData} loop autoPlay />
                 <p style={{fontSize:"1.2rem",fontWeight:"500",color:"#69768b"}}>Just a moment...</p>
                </div>
                ):null}
            </div>
          </div>
        ) : (
          <QuizCard questions={questions} topic={topic} />
        )}
      </main>
    </>
  );
}

export default App;
