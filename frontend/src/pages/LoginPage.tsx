import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"

import TextInput from "../components/TextInput";
import ErrorBox from "../components/ErrorBox";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null|string>(null);
  const navigate = useNavigate();


  // When page loads, check if user has valid token, if so, navigate them to hub (skipping login page). 
  // If they do not have a valid token, remove the token from local storage.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Send token to backend for validity check.
    fetch("http://3.143.222.205:5000/api/hub", {
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
  const handleLogin = (e:any) => {
    setError(null);
    
    // Send username and password to backend for check
    fetch("http://3.143.222.205:5000/log_in", {
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
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/hub");
      } 
      else {
        setError("Username or password not found.");
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
    <div className="fullScreen bg-gradient">
      <form className="formContainer"> {/* this is a form instead of a div just so the password field doesn't complain */}
        
        <h1 className="russo">LOG IN</h1>
        <TextInput id="username" label="Username" value={username} setValue={setUsername} onEnterPress={handleLogin}/>
        <TextInput id="password" label="Password" value={password} setValue={setPassword} onEnterPress={handleLogin} isPassword />

        <ErrorBox message={error} setMessage={setError} />

        <button type="button" className="light-button" onClick={handleLogin}>Log In</button>
        
        <span>
          Don't have an account? <a onClick={handleCreateAccount}>Create one here</a>
        </span>

      </form>
    </div>
  );
}
