import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt:", username, password);
    // Call backend here to check if login is correct


    fetch("http://localhost:5000/get_user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success === true) {
      navigate("/hub");
    } else {
      setError(data.message);
    }
    })
    .catch(err => console.error("Error:", err));
  };

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
