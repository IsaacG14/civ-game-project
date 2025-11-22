import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar"

const dummyData = [["1", "Admin", "admin@email.com", 100, 0]];

export default function Account() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [userID, setUserID] = useState(null);
  const [email, setEmail] = useState(null);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newEmail, setNewEmail] = useState(""); 

  const[showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState(""); 

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/get_player_info", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(res => {
        if (!res.ok) {
          navigate("/hub");
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      // If response is valid, display data from backend and finish loading.
      .then(data => {
        setUsername(data.username);
        setUserID(data.user_id);
        setEmail(data.email);
      })

  }, [])

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
  function handleChangeEmail(e, userID) {
    event.preventDefault(); // prevents page reload

    fetch("http://localhost:5000/change_email", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ email: newEmail }),
  })
    .then(res => res.json().then(data => {
        !res.ok ? setError("Email already taken") : navigate(0)
    }))
  }
  
  function handleChangePassword(userID) {
     event.preventDefault();

    fetch("http://localhost:5000/change_password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ password: newPassword }),
  })
    .then(res => res.json().then(data => {
        !res.ok ? setError(data.error) : navigate(0)
    }))
  }

  function handleShowEmail(){
    setShowPasswordInput(false)
    setShowEmailInput(true)
  }
  function handleShowPassword(){
    setShowEmailInput(false)
    setShowPasswordInput(true)
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
          <div className = "userID">UserID: {userID}</div>
          <div className = "accountStat">User Name: {username}</div>
          <div className = "accountStat">Email: {email}</div>
          <div className = "accountStat">Wins: {entry[3]}</div>
          <div className = "accountStat">Losses: {entry[4]}</div>

          {showEmailInput && (
            <form onSubmit={(e) => handleChangeEmail(e, userID)}>
              <input
                type="email"
                name = "email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          )}

          {showPasswordInput && (
            <form onSubmit={(e) => handleChangePassword(e, userID)}>
              <input
                type="text"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleChangePassword}>Submit</button>
            </form>
          )}
          
          {error && <p className="cuprum-600" style={{ color: "red" }}>{error}</p>}

          <div className = "buttonRow">
            <button className = "changeEmail" 
              onClick={() => handleShowEmail(entry[0])}>
              Change Email
            </button>
            <button className = "changePassword"
              onClick={() => handleShowPassword(entry[0])}>
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