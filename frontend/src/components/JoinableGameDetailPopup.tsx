import { useState } from "react";
import Popup from "./Popup";
import ErrorBox from "./ErrorBox";
import { DB_Game } from "../db-types";

type JoinableGame = DB_Game & { invite_code?: string | null; is_public?: boolean; current_players?: number };

type JoinableGameDetailPopupProps = {
  game: JoinableGame;
  close: () => void;
  onJoinSuccess?: () => void;
};

export default function JoinableGameDetailPopup(props: JoinableGameDetailPopupProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleJoinGame() {
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/join-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invite_code: props.game.invite_code || "",
        }),
      });

      if (!res.ok) {
        const errData: any = await res.json();
        setError("Failed to join game: " + (errData?.message || "Unknown error"));
        return;
      }

      console.log("Successfully joined game:", props.game.game_id);
      props.onJoinSuccess?.();
      props.close();
    } catch (err) {
      setError("Error joining game: " + err);
    }
  }

  const lightTextStyle = { color: "var(--text-light)" };

  return (
    <Popup
      id="joinable-game-detail-popup"
      title={props.game.name.toUpperCase()}
      submitText="Join Game"
      submit={handleJoinGame}
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
      </div>
    </Popup>
  );
}
