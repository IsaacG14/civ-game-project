import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CreateGamePopup from "../components/CreateGamePopup";
import JoinPrivateGamePopup from "../components/JoinPrivateGamePopup";

// Define the shape of a game from your backend
interface Game {
  game_id: number;
  name: string;
  type_name: string;
  creation_date: string;
  status: string;
  invite_code: string;
  is_public: number;
  current_players: number;
}

interface HubData {
  // define any fields your hub endpoint returns, or use unknown
  [key: string]: any;
}

export default function Hub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [joinableGames, setJoinableGames] = useState<Game[]>([]);
  const [currentGames, setCurrentGames] = useState<Game[]>([]);

  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState<boolean>(false);
  const [isJoinPopupOpen, setIsJoinPopupOpen] = useState<boolean>(false);

  // navigate to game screen by ID
  function goToGame(gameId: number) {
    navigate(`/game/${gameId}`);
  }

  // on mount — validate token, fetch hub & games
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    // If token does exists send to backend for validation.
    fetch("http://localhost:5000/api/hub", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data: HubData) => {
        setHubData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/");
      });

    fetch("http://localhost:5000/api/joinable-games")
      .then(res => res.json())
      .then((games: Game[]) => setJoinableGames(games));


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

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function accountInfo() {
    navigate("/account");
  }

  function leaderboard() {
    navigate("/leaderboard");
  }

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
    <div className="fullScreen bg-gradient" style={{ flexDirection: "column" }}>
      <Navbar
        onClickButton={accountInfo}
        clickButtonText="Account"
        onClickButton2={leaderboard}
        clickButton2Text="Leaderboard"
        onLogoutClick={logout}
      />

      {isJoinPopupOpen && <JoinPrivateGamePopup close={() => setIsJoinPopupOpen(false)} />}
      {isCreatePopupOpen && <CreateGamePopup close={() => setIsCreatePopupOpen(false)} />}

      <div className="hubContent">
        {/* Current Games */}
        <div className="hubColumn">
          <div className="hubBox">
            <h2 className="formHeader">Current Games</h2>
            {currentGames.length === 0 ? (
              <p>No Current Games</p>
            ) : (
              currentGames.map(game => (
                <p key={game.game_id}>
                  {"Name: " + game.name} <br />
                  {"Type: " + game.type_name} <br />
                  {"Created: " + game.creation_date}
                </p>
              ))
            )}
          </div>
          <button className="hub-button light-button" onClick={() => setIsCreatePopupOpen(true)}>
            Create Game
          </button>
        </div>

        {/* Joinable Games */}
        <div className="hubColumn">
          <div className="hubBox">
            <h2 className="formHeader">Joinable Games</h2>

            <div>
              {joinableGames.map(game => (
                <div
                  key={game.game_id}
                  onClick={() => goToGame(game.game_id)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <strong>{game.name}</strong> <br />
                  {"Type: " + game.type_name} <br />
                  {"Created: " + game.creation_date}
                </div>
              ))}
            </div>
          </div>

          <button className="hub-button light-button" onClick={() => setIsJoinPopupOpen(true)}>
            Join Private Game
          </button>
        </div>
      </div>
    </div>
  );
}
