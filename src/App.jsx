import { useState, useEffect } from 'react';
import './App.css';
import questionsData from './question.json';



function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsernameForm, setShowUsernameForm] = useState(true);
  const [userScores, setUserScores] = useState([]);
  // Load stored user scores when the app loads
  useEffect(() => {
    const storedUserScores = JSON.parse(localStorage.getItem('userScores')) || [];
    setUserScores(storedUserScores);
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setShowUsernameForm(false);
  };

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questionsData[currentQuestion].correctAnswer) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setShowScore(true);
      // Store the user score in local storage
      const updatedUserScores = [...userScores, { username, score: score + 1 }];
      setUserScores(updatedUserScores);
      localStorage.setItem('userScores', JSON.stringify(updatedUserScores));
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setShowUsernameForm(true);
  };

  return (
    <div className="quiz-app">
      {showUsernameForm ? (
        <form onSubmit={handleUsernameSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      ) : showScore ? (
        <div className="score-section">
          <h2>Your Score: {score}/{questionsData.length}</h2>
          <button onClick={handleRestart}>Restart</button>
          <div className="user-scores">
            <h3>Previous Scores:</h3>
            <ul>
              {userScores.map((user, index) => (
                <li key={index}>{user.username}: {user.score}/{questionsData.length}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="question-section">
          <h2>Question {currentQuestion + 1}</h2>
          <p>{questionsData[currentQuestion].question}</p>
          <div className="options">
            {questionsData[currentQuestion].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerClick(option)}>{option}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
