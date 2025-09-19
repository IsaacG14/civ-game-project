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

  /*
  This error means that you’re using the wrong password:
  ERROR 1045 (28000): Access denied for user 'sammy'@'203.0.113.0' (using password: YES)

  This access denied error means the connection string didn’t contain the -p flag but a password is required:
  ERROR 1045 (28000): Access denied for user 'sammy'@'203.0.113.0'' (using password: NO)

  This access denied error means the user does not have privileges on the database specified in the connection string:
  ERROR 1044 (42000): Access denied for user 'sammy'@'%' to database 'defaultdb'
  */

  return (
    <div>
      <h1>Civ Game</h1>
      <ul>
        {(players.error === undefined) 
          ? players.map(p => (
            <li key={p.id}>
              {p.name} ({p.civilization}) - Score: {p.score}
            </li>
          ))
          : "Error: " + players.error
        }
      </ul>
    </div>
  );
}

export default App;
