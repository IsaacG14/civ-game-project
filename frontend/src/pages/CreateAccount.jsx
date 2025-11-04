import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function CreationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    
    fetch("http://localhost:5000/sign_up", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password})
  })
    .then(res => res.json().then(data => {
      !res.ok ? setError(data.error) : navigate("/")
  }))
    
  };

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
                }}>Create Account</h1>
            <form onSubmit = {handleSignup}
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
              <input type = "email"
              placeholder= "Email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
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
              <input type = "password"
              placeholder= "Confirm Password"
              value = {confirmPassword}
              onChange = {(e) => setConfirmPassword(e.target.value)}
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
                Create Account
              </button>
            </form>
        </div>
    </div>
  );
}
