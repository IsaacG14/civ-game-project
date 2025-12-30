/*
Required installs:

npm install react react-dom react-router-dom
*/

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateGamePopup from "../components/CreateGamePopup";
import JoinPrivateGamePopup from "../components/JoinPrivateGamePopup";
import GameListBox from "../components/GameListBox";
import JoinableGameDetailPopup from "../components/JoinableGameDetailPopup";
import OngoingGameDetailPopup from "../components/OngoingGameDetailPopup";
import { DB_Game } from "../db-types";

type JoinableGame = DB_Game & { invite_code?: string | null; is_public?: boolean; current_players?: number };

export default function Hub() {
  const navigate = useNavigate();

  // Display for loading screen when credentials are submitted. True for initial page load.
  const [loading, setLoading] = useState(true);

  const [joinableGames, setJoinableGames] = useState<JoinableGame[]>([]);
  const [currentGames, setCurrentGames] = useState<DB_Game[]>([]);

  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);

  const [selectedJoinableGame, setSelectedJoinableGame] = useState<JoinableGame | null>(null);
  const [selectedOngoingGame, setSelectedOngoingGame] = useState<DB_Game | null>(null);
  


  // When page loads, check for token validity. If invalid token send user to login page.
  useEffect(() => {
    // Get token from local storage.
    const token = localStorage.getItem("token");

    // If token does not exist send user to login.
    if (!token) {
      navigate("/login");
      return;
    }

    // If token does exist send to backend for validation.
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
      // If response is valid, finish loading.
      .then(_ => {
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
      .then((games: JoinableGame[]) => {
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
      .then((games: DB_Game[]) => {
        console.log(games);
        setCurrentGames(games);
      });


  }, [navigate]);


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

  function handleJoinableGameClick(game: JoinableGame) {
    setSelectedJoinableGame(game);
  }

  function handleCurrentGameClick(game: DB_Game) {
    setSelectedOngoingGame(game);
  }

  function closeJoinableGameDetail() {
    setSelectedJoinableGame(null);
  }

  function closeOngoingGameDetail() {
    setSelectedOngoingGame(null);
  }

  function handleJoinSuccess() {
    setJoinableGames(prev => prev.filter(g => g.game_id !== selectedJoinableGame?.game_id));
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

      { isJoinPopupOpen && <JoinPrivateGamePopup close={() => setIsJoinPopupOpen(false)}/> }
      { isCreatePopupOpen && <CreateGamePopup close={() => setIsCreatePopupOpen(false)}/> }
      { selectedJoinableGame && (
        <JoinableGameDetailPopup
          game={selectedJoinableGame}
          close={closeJoinableGameDetail}
          onJoinSuccess={handleJoinSuccess}
        />
      )}
      { selectedOngoingGame && (
        <OngoingGameDetailPopup
          game={selectedOngoingGame}
          close={closeOngoingGameDetail}
        />
      )}
      
      <div className="hubContent">
        <div className="hubColumn">
          <GameListBox 
            gameList={currentGames} 
            title="Ongoing Games"
            onRowClick={handleCurrentGameClick}
          />
          <button className="hub-button light-button" onClick={() => setIsCreatePopupOpen(true)}>Create Game</button>
        </div>

        <div className="hubColumn">
          <GameListBox 
            gameList={joinableGames} 
            title="Joinable Games"
            onRowClick={handleJoinableGameClick}
          />
          <button className="hub-button light-button" onClick={() => setIsJoinPopupOpen(true)}>Join Private Game</button>
        </div>
      </div> 
    </div>
  );
}
