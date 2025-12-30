import { useState } from "react";
import Popup from "./Popup";
import ErrorBox from "./ErrorBox";
import { DB_Game } from "../db-types";

type JoinableGame = DB_Game & { invite_code?: string | null; is_public?: boolean; current_players?: number };

type RegisteredGameDetailPopupProps = {
  game: JoinableGame;
  close: () => void;
  onLeaveSuccess?: () => void;
  onStartSuccess?: () => void;
};

export default function RegisteredGameDetailPopup(props: RegisteredGameDetailPopupProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleStartGame() {
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/start-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_id: props.game.game_id }),
      });

      if (!res.ok) {
        const errData: any = await res.json();
        setError("Failed to start game: " + (errData?.message || "Unknown error"));
        return;
      }

      console.log("Successfully started game:", props.game.game_id);
      props.onStartSuccess?.();
      props.close();
    } catch (err) {
      setError("Error starting game: " + err);
    }
  }

  async function handleLeaveGame() {
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/leave-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ game_id: props.game.game_id }),
      });

      if (!res.ok) {
        const errData: any = await res.json();
        setError("Failed to leave game: " + (errData?.message || "Unknown error"));
        return;
      }

      console.log("Successfully left game:", props.game.game_id);
      props.onLeaveSuccess?.();
      props.close();
    } catch (err) {
      setError("Error leaving game: " + err);
    }
  }

  const lightTextStyle = { color: "var(--text-light)" };

  return (
    <Popup
      id="registered-game-detail-popup"
      title={props.game.name.toUpperCase()}
      submitText="Start Game"
      submit={handleStartGame}
      close={props.close}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <p style={lightTextStyle}><strong>Type:</strong> {props.game.type_name}</p>
          <p style={lightTextStyle}><strong>Status:</strong> {props.game.status}</p>
          <p style={lightTextStyle}><strong>Created:</strong> {new Date(props.game.creation_date).toLocaleString()}</p>
        </div>

        <div>
          <p style={lightTextStyle}>
            <strong>Visibility:</strong> {props.game.is_public ? "Public" : "Private"}
          </p>
          {props.game.current_players !== undefined && (
            <p style={lightTextStyle}>
              <strong>Players:</strong> {props.game.current_players}
            </p>
          )}
        </div>

        <ErrorBox message={error} setMessage={setError} />

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button className="dark-button" type="button" onClick={handleLeaveGame}>Leave Game</button>
          <div style={{ flex: 1 }} />
        </div>
      </div>
    </Popup>
  );
}
