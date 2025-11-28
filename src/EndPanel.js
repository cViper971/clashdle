import "./EndPanel.css";

export default function GameFinished({ won, card, guesses, onRestart }) {
  return (
    <div className={`finished-screen ${won ? "won" : "lost"}`}>
      <h2>{won ? "🎉 You Won!" : "❌ You Lost"}</h2>

      <img src={card.image} alt={card.name} className="finished-img" />

      <p className="card-name">{card.name}</p>

      <p className="guess-count">
        You made <strong>{guesses}</strong> guesses
      </p>

      <button className="restart-btn" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}
