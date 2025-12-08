import { useEffect, useState } from "react";
import Popup from "./Popup";
import TextInput from "./TextInput";

type CreateGamePopupProps = {
  onClose: () => void;
};

type GameTypeInfo = {
  type_name: string;
  min_players: number;
  max_players: number;
};

export default function CreateGamePopup({ onClose }: CreateGamePopupProps) {
  const [gameTypes, setGameTypes] = useState<GameTypeInfo[]>([]);
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [gameName, setGameName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
  async function loadGameTypes() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/game-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch game types", await res.text());
        return;
      }
      const data: GameTypeInfo[] = await res.json();
      setGameTypes(data);
      if (data.length > 0) {
        setSelectedGame(data[0].type_name);
        setPlayerCount(data[0].min_players);
      }
    } catch (err) {
      console.error("Error fetching game types:", err);
    }
  }

  loadGameTypes();
}, []);

  const selectedInfo = gameTypes.find((g) => g.type_name === selectedGame);

  async function handleSubmit() {
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
          is_public: !isPrivate,
          start_date: startDate,
        }),
      });

      if (!res.ok) {
        console.error("Create game failed:", await res.text());
        return;
      }

      console.log("Game created:", await res.json());
      onClose();
    } catch (err) {
      console.error("Error creating game:", err);
    }
  }

  return (
    <Popup
      id="create-game-popup"
      title="CREATE GAME"
      submitText="Create"
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <TextInput
          label="Game Name"
          id="cg-name"
          value={gameName}
          setValue={setGameName}
          onEnterPress={handleSubmit}
        />

        <label style={{ color: "white" }}>
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
          <label style={{ color: "white" }}>
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

        <label style={{ color: "white" }}>
          <input
            type="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          Private Game
        </label>

        <label style={{ color: "white" }}>
          Start Date:
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
      </div>
    </Popup>
  );
}
