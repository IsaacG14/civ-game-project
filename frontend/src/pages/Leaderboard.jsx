import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar"

const gameTypes = ["TicTacToe", "Checkers", "Uno", "War", "Blackjack", "RoShamBo"];

export default function Leaderboard() {
  const navigate = useNavigate();

  const [leaderboardData, setLeaderboardData] = useState([]);
  const[selectedGame, setSelectedGame] = useState("TicTacToe");
  
  useEffect(() => {
    fetch(`http://localhost:5000/api/leaderboard/${selectedGame}`)
      .then(res => {
        if (!res.ok) throw new Error("Rejected request");
        return res.json();
      })
      .then(data => {
        console.log("Leaderboard:", data);
        setLeaderboardData(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, [selectedGame]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  function accountInfo() {
    navigate("/account");
  }
  function hub() {
    navigate("/hub");
  }

  return (
    <div className = "fullScreen">
      <Navbar 
              onClickButton = {accountInfo}
              clickButtonText = "Account"
              onClickButton2 = {hub}
              clickButton2Text = "Hub"
              onLogoutClick = {logout}
            />
      <div className = "leaderboardColumn">
        <h1 className = "russo">Leaderboard</h1>
        <div className="gameButtons" style={{ marginBottom: "10px" }}>
          {gameTypes.map(game => (
            <button 
              key={game} 
              onClick={() => setSelectedGame(game)}
              style={{
                marginRight: "5px",
                padding: "5px 10px",
                backgroundColor: selectedGame === game ? "#886400ff" : "#ccc",
                color: selectedGame === game ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              {game}
            </button>
          ))}
        </div>
        <div className ="leaderboardRow" style = {{backgroundColor: "#886400ff", position: "sticky"}}>
          <span className = "place">#</span>
          <span className = "username">Username</span>
          <span className = "wins">W</span>
          <span className = "losses">L</span>
        </div>
        {leaderboardData.map((entry, index) => (
          <div key={index} className = "leaderboardRow">
            <span className = "place">{index + 1}</span>
            <span className = "username">{entry.username}</span>
            <span className = "wins">{entry.wins}</span>
            <span className = "losses">{entry.losses}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
