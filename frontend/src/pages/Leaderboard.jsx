import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar"

/*Remove after backend implemented*/
const dummyData = {
  TicTacToe: [["Admin", 100, 0], ["Starfallen", 10, 20], ["Noob", 0, 100], ["xXGamerXx", 30, 12]],
  Checkers: [["Bob", 10, 3], ["Charlie", 8, 8]],
  Uno: [["Alice", 5, 2]],
  War: [["Starfallen", 7, 1]],
  Blackjack: [["Admin", 15, 5]],
  RoShamBo: [["Willy", 1, 0]]
  }

export default function Leaderboard() {
  const navigate = useNavigate();

  const[selectedGame, setSelectedGame] = useState("TicTacToe");
  
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
  const currentLeaderboard = dummyData[selectedGame] || [];
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
          {Object.keys(dummyData).map(game => (
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
        {currentLeaderboard.map((entry, index) => (
          <div key={index} className = "leaderboardRow">
            <span className = "place">{index + 1}</span>
            <span className = "username">{entry[0]}</span>
            <span className = "wins">{entry[1]}</span>
            <span className = "losses">{entry[2]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
