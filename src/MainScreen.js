import React, { useEffect, useState } from "react";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import "./MainScreen.css";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Paris", "London", "Berlin", "Rome"],
    correctAnswer: "Paris",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Jupiter",
  },
  {
    question: "What is the boiling point of water?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    correctAnswer: "100°C",
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "South Korea"],
    correctAnswer: "Japan",
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Pb", "Fe"],
    correctAnswer: "Au",
  },
];

const MainScreen = ({ location }) => {
  const [playerList, setPlayerList] = useState(["Raju", "Krishna", "Veena"]);
  const [currentPlayer, setCurrentPlayer] = useState("Krishna");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [playerScores, setPlayerScores] = useState({
    Raju: 0,
    Krishna: 0,
    Veena: 0,
  });

  // Extract new player from URL query params if coming from mobile
  const searchParams = new URLSearchParams(location.search);
  const newPlayerFromMobile = searchParams.get("player");

  useEffect(() => {
    if (newPlayerFromMobile && !playerList.includes(newPlayerFromMobile)) {
      setPlayerList((prevList) => [...prevList, newPlayerFromMobile]);
      setCurrentPlayer(newPlayerFromMobile);
      setPlayerScores((prevScores) => ({
        ...prevScores,
        [newPlayerFromMobile]: 0,
      }));
    }
  }, [newPlayerFromMobile]); // Run when newPlayerFromMobile changes

  const handlePlayerChange = (e) => {
    setCurrentPlayer(e.target.value);
    setIsGameOver(false);
    setMessage("");
    setCurrentQuestion(0);
    setAnsweredQuestions({});
    setErrorMessage("");
  };

  const handleAnswer = (option) => {
    const currentQ = questions[currentQuestion];

    if (answeredQuestions[currentQuestion]) return;

    const isCorrect = option === currentQ.correctAnswer;

    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: true,
    });

    if (isCorrect) {
      setPlayerScores((prevScores) => ({
        ...prevScores,
        [currentPlayer]: prevScores[currentPlayer] + 1,
      }));

      if (currentQuestion === questions.length - 1) {
        setMessage(
          ` Congratulations, ${currentPlayer}! You've completed the quiz.`
        );
        setIsGameOver(true);
      } else {
        setMessage(`Congratulations, ${currentPlayer}! You got it right!`);
        setTimeout(() => {
          setCurrentQuestion((prev) => prev + 1);
          setMessage("");
        }, 3000);
      }
    } else {
      setMessage(`Sorry, ${currentPlayer}, that's not correct.`);
      setIsGameOver(true);
    }
  };

  const handleNewPlayer = () => {
    const newPlayer = prompt("Enter the name of the new player:");
    if (newPlayer) {
      if (playerList.includes(newPlayer)) {
        setErrorMessage(
          `Error: Player "${newPlayer}" already exists.Try a different name.`
        );
      } else {
        setPlayerList([...playerList, newPlayer]);
        setCurrentPlayer(newPlayer);
        setPlayerScores({ ...playerScores, [newPlayer]: 0 });
        setIsGameOver(false);
        setCurrentQuestion(0);
        setAnsweredQuestions({});
        setErrorMessage("");
      }
    }
  };

  const getHighestScorer = () => {
    let maxScore = -1;
    let highestScorer = "";
    for (const player in playerScores) {
      if (playerScores[player] > maxScore) {
        maxScore = playerScores[player];
        highestScorer = player;
      }
    }
    return highestScorer;
  };

  return (
    <div className="quiz-container">
      <h1 className="game-title">KBC GAME</h1>

      <div className="qr-code-section">
        <QRCode value={window.location.origin + "/join"} className="qr-code" />
        <p>Scan the QR code to join the game!</p>
      </div>

      <div className="player-selection">
        <label className="player-label">Select Player:</label>
        <select
          value={currentPlayer}
          onChange={handlePlayerChange}
          className="player-dropdown"
        >
          <option value="">--Select Player--</option>
          {playerList.map((player, index) => (
            <option key={index} value={player}>
              {player}
            </option>
          ))}
        </select>
        <button onClick={handleNewPlayer} className="add-player-btn">
          Add New Player
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {currentPlayer && !isGameOver && (
        <div className="question-section">
          <h2 className="question-number">Question {currentQuestion + 1}</h2>
          <p className="question-text">{questions[currentQuestion].question}</p>
          <ul className="options-list">
            {questions[currentQuestion].options.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleAnswer(option)}
                  className="option-btn"
                  disabled={answeredQuestions[currentQuestion]} // Disable after answering
                >
                  {option}
                </button>
              </li>
            ))}
          </ul>
          {message && <p className="message">{message}</p>}
        </div>
      )}

      {isGameOver && (
        <div className="summary-section">
          <h4 className="game-over">Game is over!</h4>
          <p>
            {currentPlayer}: {playerScores[currentPlayer]} correct answers
          </p>

          <h4 className="highest-scorer">
            {getHighestScorer()} answered the most questions correctly!
          </h4>
        </div>
      )}
    </div>
  );
};

export default MainScreen;
