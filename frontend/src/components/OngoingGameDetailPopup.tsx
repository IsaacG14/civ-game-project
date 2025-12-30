import { useState, useEffect } from "react";
import Popup from "./Popup";
import { DB_Game, DB_Ongoing_Game } from "../db-types";

type OngoingGameDetailPopupProps = {
  game: DB_Game;
  close: () => void;
};

export default function OngoingGameDetailPopup(props: OngoingGameDetailPopupProps) {
  const [ongoingData, setOngoingData] = useState<DB_Ongoing_Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOngoingGameData() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/game-${props.game.game_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setOngoingData(data[0] || null);
        }
      } catch (err) {
        console.error("Error fetching ongoing game data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOngoingGameData();
  }, [props.game.game_id]);

  const lightTextStyle = { color: "var(--text-light)" };

  return (
    <Popup
      id="ongoing-game-detail-popup"
      title={props.game.name.toUpperCase()}
      submitText="Close"
      submit={props.close}
      close={props.close}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div>
          <p style={lightTextStyle}><strong>Type:</strong> {props.game.type_name}</p>
          <p style={lightTextStyle}><strong>Status:</strong> {props.game.status}</p>
          <p style={lightTextStyle}><strong>Created:</strong> {new Date(props.game.creation_date).toLocaleString()}</p>
        </div>

        {loading ? (
          <p style={lightTextStyle}>Loading game details...</p>
        ) : ongoingData ? (
          <div>
            <p style={lightTextStyle}><strong>Location:</strong> {ongoingData.location_url || "N/A"}</p>
            {ongoingData.turn_end_date && (
              <p style={lightTextStyle}>
                <strong>Turn Ends:</strong> {new Date(ongoingData.turn_end_date).toLocaleString()}
              </p>
            )}
          </div>
        ) : (
          <p style={lightTextStyle}>No additional game data available</p>
        )}
      </div>
    </Popup>
  );
}
