import "./Guesses.css";

export default function WrongGuesses({ guesses }) {
  if (guesses.length === 0) return null;

  return (
    <div className="wrong-guesses">
      <h3>Wrong Guesses</h3>
      <div className="guess-list">
        {guesses.map((g, i) => (
          <div key={i} className="guess-item">
            {g}
          </div>
        ))}
      </div>
    </div>
  );
}
