/*
Required installs:

npm install react react-dom react-router-dom
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar"
import Popup from "../components/Popup";
import TextInput from "../components/TextInput";
import CreateGamePopup from "../components/CreateGamePopup";
import JoinPrivateGamePopup from "../components/JoinPrivateGamePopup";

export default function Hub() {
  const navigate = useNavigate();

  // Display for loading screen when credentials are submitted. True for initial page load.
  const [loading, setLoading] = useState(true);

  // Data from backend to be displayed on screen.
  const [hubData, setHubData] = useState(null);

  const [joinableGames, setJoinableGames] = useState([]);

  const [currentGames, setCurrentGames] = useState([]);

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



    fetch("http://localhost:5000/api/joinable-games") 
      .then(res => {
        if (!res.ok) throw new Error("Rejected request -- " + res.body);
        return res.json();
      })
      // If there is a valid response navigate to hub.
      .then(games => {
        console.log(games);
        setJoinableGames(games);
      });
    fetch("http://localhost:5000/api/current-games", {
      headers: { Authorization: "Bearer " + token }
    }) 
      .then(res => {
        if (!res.ok) throw new Error("Rejected request");
        return res.json();
      })
      // If there is a valid response navigate to hub.
      .then(games => {
        console.log(games);
        setCurrentGames(games);
      });


  }, [navigate]);


  function onCreateGameClick(e) {
    document.querySelector("#create-game-popup").showModal();
  }
  function onCreateGameClose(e) {
    document.querySelector("#create-game-text-input").value = "";
  }
  function onCreateGameSubmit(e) {
    document.querySelector("#create-game-text-input").value = "";
  }
  function onJoinPrivateGameClick(e) {
    document.querySelector("#join-private-game-popup").showModal();
  }
  function onJoinPrivateGameClose(e) {
    document.querySelector("#join-private-game-text-input").value = "";
  }
  function onJoinPrivateGameSubmit(e) {
    document.querySelector("#join-private-game-text-input").value = "";
  }


  // Deletes token from local storage and sends user to login page on button click.
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }
  function accountInfo() {
    navigate("/account");
  }
  function leaderboard() {
    navigate("/leaderboard");
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
    <div className="fullScreen bg-gradient" style = {{ flexDirection: "column" }}>
      <Navbar 
        onClickButton={accountInfo}
        clickButtonText="Account"
        onClickButton2={leaderboard}
        clickButton2Text="Leaderboard"
        onLogoutClick={logout}
      />

      <CreateGamePopup onClick={onCreateGameClick}/>
      <JoinPrivateGamePopup onClick={onJoinPrivateGameClick}/>
      
      <div className = "hubContent">
        <div className = "hubColumn">
          <div className = "hubBox">
            <h2 className = "formHeader">Current Games</h2>
            {currentGames.length === 0 ? (
              <p>No Current Games</p>
            ) : (
              currentGames.map(game => (
                <p key={game.game_id}>
                  {"Name: " + game.name} <br /> {"Type: " + game.type_name} <br /> {"Created: " + game.creation_date}
                </p>
              ))
            )}
          </div>
          <button className="hub-button light-button" onClick={onCreateGameClick}>Create Game</button>
        </div>

        <div className = "hubColumn">
          <div className = "hubBox">
            <h2 className = "formHeader">Joinable Games</h2>
            <div>{joinableGames.map(game => (<p key={game.game_id}>
              {"Name: " + game.name} <br/> {"Type: " + game.type_name} <br/> {"Created: " + game.creation_date}
            </p>))}</div>
          </div>
          <button className="hub-button light-button" onClick={onJoinPrivateGameClick}>Join Private Game</button>
        </div>
      </div> 
    </div>
  );
}
