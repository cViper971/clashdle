import { useEffect, useState } from "react";
import "./App.css";
import WrongGuesses from "./Guesses";
import GameFinished from "./EndPanel";

export default function App() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(null);
  const [guess, setGuess] = useState("");
  const [showList, setShowList] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const [won, setWon] = useState(false);
  const [totalGuesses, setTotalGuesses] = useState(0);

  useEffect(() => {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      });
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
      />
    );
  }

  return (
    <div className="container">
      <h1>Guess the Clash Royale Card</h1>

      <img className="main-img" src={current.image} alt="mystery card" />

      <div className="guess-box">
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

      <button onClick={checkGuess}>Guess</button>

      <WrongGuesses guesses={[...wrongGuesses].reverse()} />
    </div>
  );
}
