import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextInput from "../components/TextInput";

export default function CreateAccountPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return; 
    }
    
    fetch("http://localhost:5000/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username,email: email, password: password})
    })
      .then(res => res.json().then(data => {
        !res.ok ? setError(data.error) : navigate("/")
    }))
  };

  const backToLogin = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className = "fullScreen">
      <form className = "formContainer">
        <h1 className="russo">CREATE ACCOUNT</h1>

        <TextInput id="username" label="Username" value={username} setValue={setUsername} required />
        <TextInput id="email" label="Email" value={email} setValue={setEmail} required />
        <TextInput id="password" label="Password" value={password} setValue={setPassword} isPassword />
        <TextInput id="confirmpas" label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} isPassword />

        {error && <p className="cuprum-600" style={{ color: "red" }}>{error}</p>}

        <button type="button" className="formSubmitButton cuprum-600" onClick={handleSignup}>Create Account</button>

        <span className="cuprum-600">
          Already have an account? <a onClick={backToLogin}>Log in here</a>
        </span>
      </form>
    </div>
  );
}