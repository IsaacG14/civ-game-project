import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar"

const dummyData = [["1", "Admin", "admin@email.com", 100, 0]];

export default function Account() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
    }
  function leaderboard() {
    navigate("/leaderboard");
    }
  function hub() {
    navigate("/hub");
    }
  function handleChangeEmail(userID) {
    console.log("Change email was clicked by: ", userID);
  }
  function handleChangePassword(userID) {
    console.log("Change password was clicked by: ", userID);
  }
  function handleDeleteAccount(userID) {
    console.log("Delete account was clicked by: ", userID);
  }
  return (
    <div className = "fullScreen">
          <Navbar 
                  onClickButton = {hub}
                  clickButtonText = "Hub"
                  onClickButton2 = {leaderboard}
                  clickButton2Text = "Leaderboard"
                  onLogoutClick = {logout}
                />
      {dummyData.map((entry, index) => (
      <div key={index} className = "accountColumn">
          <div className = "userID">UserID: {entry[0]}</div>
          <div className = "accountStat">User Name: {entry[1]}</div>
          <div className = "accountStat">Email: {entry[2]}</div>
          <div className = "accountStat">Wins: {entry[3]}</div>
          <div className = "accountStat">Losses: {entry[4]}</div>
          <div className = "buttonRow">
            <button className = "changeEmail" 
              onClick={() => handleChangeEmail(entry[0])}>
              Change Email
            </button>
            <button className = "changePassword"
              onClick={() => handleChangePassword(entry[0])}>
                Change Password
            </button>
            <button className = "deleteButton"
              onClick={() => handleDeleteAccount(entry[0])}>
                Delete Account
            </button>
          </div>
      </div>
      ))}
    </div>
  );
}