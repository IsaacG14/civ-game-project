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
    console.log("Signup attempt:", username, email, password, confirmPassword);
    localStorage.setItem("username", username);
    localStorage.setItem("password", password); 
    //call backend here to add account
    navigate("/");
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