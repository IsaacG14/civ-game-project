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
    <div className="fullScreen bg-gradient">
      <Navbar 
          onClickButton = {accountInfo}
          clickButtonText = "Account"
          onClickButton2 = {hub}
          clickButton2Text = "Hub"
          onLogoutClick = {logout}
      />
      <div className="leaderboard-column">
        <h1 className="russo">LEADERBOARD</h1>
        <div className="game-buttons">
          {gameTypes.map(game => (
            <button 
                type="button" 
                key={game} 
                onClick={() => setSelectedGame(game)}
                className={selectedGame === game ? "selected" : undefined}
            >
              {game}
            </button>
          ))}
        </div>
        <div className="leaderboard-row header">
          <span className="place">#</span>
          <span className="username">Username</span>
          <span className="wins">W</span>
          <span className="losses">L</span>
        </div>
        <div id="leaderboard-entry-container">
          {leaderboardData.map((entry, index) => (
            <div key={index} className="leaderboard-row">
              <span className="place">{index + 1}</span>
              <span className="username">{entry.username}</span>
              <span className="wins">{entry.wins}</span>
              <span className="losses">{entry.losses}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
