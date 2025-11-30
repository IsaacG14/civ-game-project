import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar"
import ErrorBox from "../components/ErrorBox";

const dummyData = [["1", "Admin", "admin@email.com", 100, 0]];

export default function Account() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string|null>(null);
  const [userID, setUserID] = useState<string|null>(null);
  const [email, setEmail] = useState<string|null>(null);

  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newEmail, setNewEmail] = useState(""); 

  const[showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState(""); 

  const [error, setError] = useState<string|null>(null);

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
    });

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

  function handleChangeEmail(e:any) {
    if (e) e.preventDefault(); // prevents page reload

    setError(null);

    fetch("http://localhost:5000/change_email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ email: newEmail }),
    })
    .then(async res => {
      const data = await res.json();
      return [res, data];
    })
    .then(([res, data]) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/hub");
        }
        else {
          setError("Email already taken");
        }
      }
      else {
        navigate(0);
      }
    });
  }
  
  function handleChangePassword(e:any) {
    if (e) e.preventDefault();

    setError(null);

    fetch("http://localhost:5000/change_password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ password: newPassword }),
    })
    .then(async res => {
      const data = await res.json();
      return [res, data];
    })
    .then(([res, data]) => {
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/hub");
        }
        else {
          setError(data.error);
        }
      }
      else {
        navigate(0);
      }
    });
  }

  function handleShowEmail(){
    setShowPasswordInput(false)
    setShowEmailInput(true)
  }
  function handleShowPassword(){
    setShowEmailInput(false)
    setShowPasswordInput(true)
  }

  function handleDeleteAccount(e:any) {
    setError(null);

    fetch("http://localhost:5000/delete_account", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Unauthorized");
      }
      localStorage.removeItem("token");
      navigate("/hub");
      return res.json();
    });
  }


  return (
    <div className = "fullScreen bg-gradient">
          <Navbar 
                  onClickButton = {hub}
                  clickButtonText = "Hub"
                  onClickButton2 = {leaderboard}
                  clickButton2Text = "Leaderboard"
                  onLogoutClick = {logout}
                />
      {dummyData.map((entry, index) => (
      <div key={index} className = "accountColumn">
        <div className="solid-panel">

          <div className = "userID">UserID: {userID}</div>
          <div className = "accountStat">User Name: {username}</div>
          <div className = "accountStat">Email: {email}</div>
          <div className = "accountStat">Wins: {entry[3]}</div>
          <div className = "accountStat">Losses: {entry[4]}</div>

          {showEmailInput && (
            <form onSubmit={handleChangeEmail}>
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
            <form onSubmit={handleChangePassword}>
              <input
                type="text"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleChangePassword}>Submit</button>
            </form>
          )}
          
          <ErrorBox message={error} setMessage={setError} />

          <div className = "buttonRow">
            <button className = "changeEmail" 
              onClick={() => handleShowEmail()}>
              Change Email
            </button>
            <button className = "changePassword"
              onClick={() => handleShowPassword()}>
                Change Password
            </button>
            <button className = "deleteButton"
              onClick={handleDeleteAccount}>
                Delete Account
            </button>
          </div>

        </div>
          
      </div>
      ))}
    </div>
  );
}