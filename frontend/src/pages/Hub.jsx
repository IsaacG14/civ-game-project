/*
Required installs:

npm install react react-dom react-router-dom
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Hub() {
  const navigate = useNavigate();

  // Display for loading screen when credentials are submitted. True for initial page load.
  const [loading, setLoading] = useState(true);

  // Data from backend to be displayed on screen.
  const [hubData, setHubData] = useState(null);

  // When page loads, check for token validity. If invalid token send user to login page.
  useEffect(() => {
    // Get token from local storage.
    const token = localStorage.getItem("token");

    // If token does not exists send user to login.
    if (!token) {
      navigate("/login");
      return;
    }

    // If token does exists send to backend for validation.
    fetch("http://localhost:5000/api/hub", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      // If response is an error, token is invalid, return error.
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      // If response is valid, display data from backend and finish loading.
      .then(data => {
        setHubData(data);
        setLoading(false);
      })
      // On error, display error, remove token from local storage, and send user to login.
      .catch(err => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // Deletes token from local storage and sends user to login page on button click.
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Display on loading.
  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ffffff",
        flexDirection: "column",
      }}
    >
      <h1>Hub</h1>
      <p>{hubData ? hubData.message : "No data"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
