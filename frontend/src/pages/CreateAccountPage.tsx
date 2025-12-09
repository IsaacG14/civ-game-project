import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import TextInput from "../components/TextInput";
import ErrorBox from "../components/ErrorBox";

export default function CreateAccountPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  const handleSignup = (e:any) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return; 
    }

    setError(null);
    
    fetch("http://3.143.222.205:5000/sign_up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, email: email, password: password })
    })
      .then(res => res.json().then(data => {
        if (res.ok) {
          navigate("/");
        }
        else {
          setError(data.error);
        }
    }));
  };

  const backToLogin = (e:any) => {
    navigate("/");
  };

  return (
    <div className = "fullScreen bg-gradient">
      <form className = "formContainer">
        <h1 className="russo">CREATE ACCOUNT</h1>

        <TextInput id="username"   label="Username"         value={username}        setValue={setUsername}        onEnterPress={handleSignup} />
        <TextInput id="email"      label="Email"            value={email}           setValue={setEmail}           onEnterPress={handleSignup} />
        <TextInput id="password"   label="Password"         value={password}        setValue={setPassword}        onEnterPress={handleSignup} isPassword />
        <TextInput id="confirmpas" label="Confirm Password" value={confirmPassword} setValue={setConfirmPassword} onEnterPress={handleSignup} isPassword />

        <ErrorBox message={error} setMessage={setError} />

        <button type="button" className="light-button" onClick={handleSignup}>Create Account</button>

        <span>
          Already have an account? <a onClick={backToLogin}>Log in here</a>
        </span>
      </form>
    </div>
  );
}