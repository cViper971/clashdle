import { useEffect, useState } from "react";
import "./App.css";
import WrongGuesses from "./Guesses";

export default function App() {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(null);
  const [guess, setGuess] = useState("");
  const [showList, setShowList] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);

  useEffect(() => {
    fetch("/cards.json")
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setCurrent(data[Math.floor(Math.random() * data.length)]);
      });
  }, []);

  if (!current) return <p>Loading...</p>;

  const filtered = cards.filter(c => c.name.toLowerCase().startsWith(guess.toLowerCase()))

  function handleGuess(name) {
    setGuess(name);
    setShowList(false);
  }

  function checkGuess() {
    if (guess.toLowerCase() === current.name.toLowerCase()) {
      alert("✅ Correct!");
      const newCard = cards[Math.floor(Math.random() * cards.length)];
      setCurrent(newCard);
      setGuess("");
    } else {
      setWrongGuesses(prev => [...prev, guess]);
      setGuess("");
    }
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

      <WrongGuesses guesses={wrongGuesses} />
    </div>
  );
}
