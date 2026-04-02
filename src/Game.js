import { useEffect, useState } from "react";
import "./App.css";
import WrongGuesses from "./Guesses";
import Victories from "./Victories";
import GameFinished from "./EndPanel";
import SparseImage from "./SparseImage";

export default function Game() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(null);
  const [guess, setGuess] = useState("");
  const [showList, setShowList] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [won, setWon] = useState(false);
  const [totalGuesses, setTotalGuesses] = useState(0);
  const [victories, setVictories] = useState(0);

  useEffect(() => {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      });
    fetch("http://localhost:3001/api/victories")
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
      fetch("http://localhost:3001/api/victories", { method: "POST" })
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
