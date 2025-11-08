import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar"
import TextInput from "../components/TextInput";

/*Remove after backend implemented*/
const dummyData = [["Admin", 100, 0], ["Starfallen", 10, 20], ["Noob", 0, 100], ["xXGamerXx", 30, 12]];

export default function Leaderboard() {
  const navigate = useNavigate();
  
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
              onAccountClick = {accountInfo}
              onSpecialClick = {hub}
              specialClick = "Hub"
              onLogoutClick = {logout}
            />
      <div className = "leaderboardColumn">
        <h1 className = "russo">Leaderboard</h1>
        <div className ="leaderboardRow" style = {{backgroundColor: "#886400ff"}}>
          <span className = "place">#</span>
          <span className = "username">Username</span>
          <span className = "wins">W</span>
          <span className = "losses">L</span>
        </div>
        {dummyData.map((entry, index) => (
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
