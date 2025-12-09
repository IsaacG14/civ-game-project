// GamePage.tsx
import React, { ReactElement, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import createGame from "../game/gameConstructor";
import { EventBus } from "../game/EventBus";
import { eventNames, GAME_DATA_KEY, GameData } from "../constants";

async function fetchGameData(id: number): Promise<GameData | undefined> {
  const res = await fetch(`http://localhost:5000/api/game/${id}`);
  if (!res.ok) {
    console.error("Server responded with failure", res);
    return undefined;
  }
  const data = await res.json();
  console.log("Fetched game data:", data); // 🔹 log the game type
  return data;
}

export default function GamePage(): ReactElement {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? Number(idParam) : undefined;

  const [gameData, setGameData] = useState<GameData | undefined>(undefined);
  const phaserRef = useRef<Phaser.Game | null>(null);

  useLayoutEffect(() => {
    if (!id) return;

    let destroyed = false;

    fetchGameData(id)
      .then(data => {
        if (destroyed || !data) return;
        setGameData(data);

        // Create Phaser game
        phaserRef.current = createGame("game-container");

        // Immediately set registry so Preloader can switch scenes
        const g: any = phaserRef.current;
        if (g.registry && typeof g.registry.set === "function") {
          g.registry.set(GAME_DATA_KEY, data);
          console.log("Set game data in registry:", g.registry.get(GAME_DATA_KEY));
        }

        // Emit update so Preloader triggers switchScene
        EventBus.emit(eventNames.GAME_DATA_UPDATED);
      })
      .catch(err => console.error("Failed to fetch game data:", err));

    return () => {
      destroyed = true;

      // Destroy Phaser game on cleanup
      if (phaserRef.current) {
        try {
          phaserRef.current.destroy(true);
        } catch (e) {
          console.warn("Phaser destroy error:", e);
        }
        phaserRef.current = null;
      }

      // Remove event listeners
      try {
        EventBus.removeAllListeners();
      } catch {}
    };
  }, [id]);

  return (
    <div
      className="fullScreen bg-gradient"
      style={{
        width: "1024px",  // Fixed size for testing
        height: "768px",  // Fixed size for testing
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 8 }}>Game #{id}</h1>
      <div
        id="game-container"
        style={{ width: "100%", height: "100%", border: "1px solid #000" }}
      />
    </div>
  );
}
