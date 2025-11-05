import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function CreationPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
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
      <div className = "formContainer">
        <h1 className = "formHeader">Create Account</h1>
          <form id = "accountForm" onSubmit = {handleSignup}>
            <label htmlFor="username">Username</label>
            <input id = "username"
              type = "text" 
              className = "textInput"
              placeholder = "Username" 
              value = {username} 
              required
              onChange = {(e) => setUsername(e.target.value)}/>
            <label htmlFor="email">Email</label>
            <input id = "email"
              type = "email" 
              className = "textInput"
              placeholder = "Email" 
              value = {email} 
              required
              onChange = {(e) => setEmail(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <input id = "password"
              type = "password" 
              className = "textInput"
              placeholder = "Password" 
              value = {password} 
              required 
              onChange = {(e) => setPassword(e.target.value)} 
              />
            <label htmlFor="confirmpas">Confirm Password</label>
            <input id = "confirmpas"
              type = "password" 
              className = "textInput"
              placeholder = "Confirm Password" 
              value = {confirmPassword} 
              required
              onChange = {(e) => setConfirmPassword(e.target.value)} />
            <button type = "submit" className = "formSubmitButton">
              Create Account
            </button>
            <button type = "button" className = "formExtraButton" onClick = {backToLogin}>
              Already have an account? Log In
            </button>
          </form>
      </div>
    </div>
  );
}