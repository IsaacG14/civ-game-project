/*
Required installs:

npm install react react-dom react-router-dom
*/

import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  // When page loads, check if user has valid token, if so, navigate them to hub (skipping login page). 
  // If they do not have a valid token, remove the token from local storage.
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Send token to backend for validity check.
  fetch("http://localhost:5000/api/hub", {
    headers: { Authorization: "Bearer " + token },
  }) 
    // If there is a invalid response from backend return error message.
    .then(res => {
      if (!res.ok) throw new Error("Invalid token");
      return res.json();
    })
    // If there is a valid response navigate to hub.
    .then(() => navigate("/hub"))
    // On invalid response remove token from local storage.
    .catch(() => localStorage.removeItem("token")); 
}, [navigate]);

  // On login button click send credentials to backend. On succesful login a token will be stored in local storage to allow users to go to hub.
  const handleLogin = (e) => {
    // Prevents page reloading on button click
    e.preventDefault();

    console.log("Login attempt:", username, password);
    
    // Send username and password to backend for check
    fetch("http://localhost:5000/log_in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password})
  })
    // Make response into a json file.
    .then(res => res.json())
    // If credentials are valid, token is sent, otherwise not token is sent.
    // If token exists store it locally and navigate to hub.
    // If token does not exist show login error and remove tokens just in case.
    .then(data => {
      if (data.token){
        localStorage.setItem("token", data.token)
        navigate("/hub")
      } 
      else {
        setError("Username or password not found.")
        localStorage.removeItem("token");
      }
    })
    // Display error.
    .catch(err => console.error("Error:", err));
  };

  // Navigation to create account on button click.
  const handleCreateAccount = () => {
    navigate("/createAccount");
  }



  return (
    
    <div style = {{
      display: "flex",
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      backgroundColor: "#AAFF00"}}>
        <div style = {{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          width: "300px",
          textAlign: "center",
          }}>
            <h1 style = {{
              marginBottom: "20px", 
              color: "#000"
              }}>Login</h1>
            <form onSubmit = {handleLogin}
            style = {{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              }}>
              <input type = "text"
              placeholder = "Username"
              value = {username}
              onChange = {(e) => setUsername(e.target.value)}
              required
              style = {{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}/>
              <input type = "password"
              placeholder= "Password"
              value = {password}
              onChange = {(e) => setPassword(e.target.value)}
              required
              style = {{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}/>
            {error && <p style={{ color: "red" }}>{error}</p>}

              <button type = "submit"
              style = {{backgroundColor: "#007bff",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              }}>
                Login
              </button>
            </form>
            <button onClick = {handleCreateAccount}
            style = {{
              marginTop:"15px",
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}>
              Create a New Account
            </button>
        </div>
    </div>
  );
}
