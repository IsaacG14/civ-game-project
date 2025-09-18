import { useEffect, useState } from "react";

function App() {
  // ✅ Make sure you define both players and setPlayers
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    fetch("/players")  // proxy handles the backend URL
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error("Error fetching players:", err));
  }, []);

  return (
    <div>
      <h1>Civ Game</h1>
      <ul>
        {players.map(p => (
          <li key={p.id}>
            {p.name} ({p.civilization}) - Score: {p.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
