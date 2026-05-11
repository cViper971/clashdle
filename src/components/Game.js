import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import WrongGuesses from "./Guesses";
import Victories from "./Victories";
import GameFinished from "./EndPanel";
import SparseImage from "./SparseImage";
import UserMenu from "./UserMenu";

export default function Game() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(null);
  const [guess, setGuess] = useState("");
  const [showList, setShowList] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [won, setWon] = useState(false);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [victories, setVictories] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) {
          navigate("/");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUsername(data.username);
      });
  }, [navigate]);

  useEffect(() => {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      });
    fetch("http://localhost:3001/api/victories", { credentials: "include" })
      .then(res => res.json())
      .then(data => setVictories(data.victories));
  }, []);

  if (!current) return <p>Loading...</p>;

  const filtered = cards.filter(c =>
    c.name.toLowerCase().startsWith(guess.toLowerCase())
  );

  function handleGuess(name) {
    setGuess(name);
    setShowList(false);
  }

  function checkGuess() {
    if (!guess) return;

    setTotalGuesses(prev => prev + 1);

    if (guess.toLowerCase() === current.name.toLowerCase()) {
      setWon(true);
      fetch("http://localhost:3001/api/victories", { method: "POST", credentials: "include" })
        .then(res => res.json())
        .then(data => setVictories(data.victories));
      return;
    }

    const wrongCard = cards.find(
      c => c.name.toLowerCase() === guess.toLowerCase()
    );

    if (wrongCard) {
      setWrongGuesses(prev => [...prev, wrongCard]);
      setCards(prev => prev.filter(c => c.name !== wrongCard.name));
    }

    setGuess("");
  }

  function restartGame() {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
        setGuess("");
        setWrongGuesses([]);
        setShowList(false);
        setWon(false);
        setTotalGuesses(0);
      });
  }

  if (won) {
    return (
      <GameFinished
        won={won}
        card={current}
        guesses={totalGuesses}
        onRestart={restartGame}
        victories={victories}
      />
    );
  }

  return (
    <div className="container">
      <UserMenu username={username} />
      <Victories victories={victories} />
      <h1>Guess the Clash Royale Card</h1>

      <SparseImage src={current.image} totalGuesses={totalGuesses} />

      <div className="guess-box">
        <div className="guess-row">
          <input
            type="text"
            value={guess}
            onChange={(e) => {
              setGuess(e.target.value);
              setShowList(true);
            }}
            placeholder="Type your guess..."
            onFocus={() => setShowList(true)}
          />
          <button onClick={checkGuess}>Guess</button>
        </div>
        {showList && guess && (
          <div className="dropdown">
            {filtered.map(c => (
              <div
                key={c.name}
                className="dropdown-item"
                onClick={() => handleGuess(c.name)}
              >
                <img src={c.image} alt={c.name} />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <WrongGuesses guesses={[...wrongGuesses].reverse()} />
    </div>
  );
}
