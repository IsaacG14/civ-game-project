// GamePage.tsx
import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import createGame from "../game/gameConstructor";
import { EventBus } from "../game/EventBus";
import { eventNames, GAME_DATA_KEY, GameData } from "../constants";

async function fetchGameData(id: number): Promise<GameData | undefined> {

    const res = await fetch(`http://3.143.222.205:5000/api/game-${id}`);

    if (!res.ok) {
        console.error('Server responded with failure', res);
        if (res.status === 404) {
            return undefined;
        }
        else {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
    }

    const g = await res.json();
    return g;
}

export default function GamePage(): ReactElement {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? Number(idParam) : undefined;

  const [gameData, setGameData] = useState<GameData | undefined>(undefined);
  const phaserRef = useRef<Phaser.Game | null>(null);

  const navigate = useNavigate(); // ✅ add navigate

  useLayoutEffect(() => {
    if (!id) return;

    let destroyed = false;

    fetchGameData(id)
      .then(data => {
        if (destroyed || !data) return;
        setGameData(data);

        phaserRef.current = createGame("game-container");

        const g: any = phaserRef.current;
        if (g.registry && typeof g.registry.set === "function") {
          g.registry.set(GAME_DATA_KEY, data);
          console.log("Set game data in registry:", g.registry.get(GAME_DATA_KEY));
        }

        EventBus.emit(eventNames.GAME_DATA_UPDATED);
      })
      .catch(err => console.error("Failed to fetch game data:", err));

    return () => {
      destroyed = true;

      if (phaserRef.current) {
        try {
          phaserRef.current.destroy(true);
        } catch (e) {
          console.warn("Phaser destroy error:", e);
        }
        phaserRef.current = null;
      }

      try {
        EventBus.removeAllListeners();
      } catch {}
    };
  }, [id]);

  return (
    <div
      className="fullScreen bg-gradient"
      style={{
        width: "1024px",
        height: "768px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 8 }}>Game #{id}</h1>

      {/* Button to navigate back to hub */}
      <button
        onClick={() => navigate("/hub")}
        style={{
          margin: "8px 0",
          padding: "8px 16px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Back to Hub
      </button>

      <div
        id="game-container"
        style={{ width: "100%", height: "100%", border: "1px solid #000" }}
      />
    </div>
  );
}
