import { useEffect, useState } from "react";
import Popup from "./Popup";
import TextInput from "./TextInput";
import ErrorBox from "./ErrorBox";
import { DB_Game_Type } from "../db-types";

type CreateGamePopupProps = {
  close: () => void;
};

type CreateGameResponse = { message: string; game_id: number; invite_code: string };

export default function CreateGamePopup(props: CreateGamePopupProps) {
  const [gameTypes, setGameTypes] = useState<DB_Game_Type[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [gameName, setGameName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [startDate, setStartDate] = useState("");

  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    async function loadGameTypes() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/game-types", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Failed to fetch game types: " + (await res.json())?.message);
          return;
        }
        const data: DB_Game_Type[] = await res.json();
        setGameTypes(data);
        if (data.length > 0) {
          setSelectedGame(data[0].type_name);
          setPlayerCount(data[0].min_players);
        }
      } 
      catch (err) {
        setError("Error fetching game types: " + err);
      }
    }

    loadGameTypes();
  }, []);

  const selectedInfo = (gameTypes.find) ? gameTypes.find((g) => g.type_name === selectedGame) : undefined;

  async function submit() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/create-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type_name: selectedGame,
          name: gameName,
          player_count: playerCount,
          invite_code: inviteCode,
          start_date: startDate,
        }),
      });

      if (!res.ok) {
        const errData: any = await res.json();
        setError("Create game failed: " + errData?.message);
        return;
      }

      const createResp: CreateGameResponse = await res.json();
      console.log("Game created:", createResp);
      props.close();
    } catch (err) {
      setError("Error creating game: " + err);
    }
  }

  const lightTextStyle = { color: "var(--text-light)" };

  return (
    <Popup
      id="create-game-popup"
      title="CREATE GAME"
      submitText="Create"
      submit={submit}
      close={props.close}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TextInput label="Game Name" id="cg-name" value={gameName} setValue={setGameName}
          onEnterPress={submit}
        />

        <label style={lightTextStyle}>
          Game Type:
          <select
            value={selectedGame}
            onChange={(e) => {
              setSelectedGame(e.target.value);
              const info = gameTypes.find((g) => g.type_name === e.target.value);
              if (info) setPlayerCount(info.min_players);
            }}
          >
            {gameTypes.map((gt) => (
              <option key={gt.type_name} value={gt.type_name}>
                {gt.type_name}
              </option>
            ))}
          </select>
        </label>

        {selectedInfo && (
          <label style={lightTextStyle}>
            Number of Players:
            <input
              type="number"
              value={playerCount}
              min={selectedInfo.min_players}
              max={selectedInfo.max_players}
              onChange={(e) => setPlayerCount(Number(e.target.value))}
            />
            <small>
              allowed: {selectedInfo.min_players}-{selectedInfo.max_players}
            </small>
          </label>
        )}

        <TextInput label="Invite Code (optional)" id="invite-code" value={inviteCode}
          setValue={(v: string) => {
            if (v.length <= 10) setInviteCode(v);
          }}
          onEnterPress={submit}
        />
        <small style={lightTextStyle}>
          Enter a code to make the game private (max 10 characters)
        </small>

        <label style={lightTextStyle}>
          Start Date:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        
        <ErrorBox message={error} setMessage={setError}/>
      </div>
    </Popup>
  );
}
