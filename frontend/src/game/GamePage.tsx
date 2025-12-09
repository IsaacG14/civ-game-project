// GamePage.tsx
import React, { ReactElement, useLayoutEffect, useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import createGame from "../game/gameConstructor";
import { EventBus } from "../game/EventBus";
import { eventNames, GAME_DATA_KEY, GameData } from "../constants";

/** If your project is plain JS, remove the type annotations below. */

async function fetchGameData(id: number): Promise<GameData | undefined> {
  const res = await fetch(`http://localhost:5000/api/game/${id}`);

  if (!res.ok) {
    console.error("Server responded with failure", res);
    return undefined;
  }
  return await res.json();
}

export default function GamePage(): ReactElement {
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? Number(idParam) : undefined;

  // strongly type state & refs
  const [gameData, setGameData] = useState<GameData | undefined>(undefined);
  const gameDataRef = useRef<GameData | undefined>(undefined);

  // phaserRef typed as Phaser.Game or null
  const phaserRef = useRef<Phaser.Game | null>(null);

  // keep reference up to date (so event listeners can read the latest)
  useEffect(() => {
    gameDataRef.current = gameData;

    // Safely set Phaser registry if game exists and registry exists.
    // Phaser types sometimes don't expose 'registry' on the Game type
    // so we cast to any where necessary.
    if (phaserRef.current) {
      // use optional chaining and a cast to avoid TypeScript complaints
      const g: any = phaserRef.current;
      if (g.registry && typeof g.registry.set === "function") {
        g.registry.set(GAME_DATA_KEY, gameData);
      }
    }
  }, [gameData]);

  // onDoneLoading needs a stable identity so we can remove it on cleanup
  const onDoneLoading = useCallback((sceneInstance: Phaser.Scene) => {
    // Scene has a registry property that's safe to use
    try {
      // write the latest game data into the scene registry
      (sceneInstance.registry as any).set(GAME_DATA_KEY, gameDataRef.current);

      // notify the game that data is updated (your EventBus convention)
      EventBus.emit(eventNames.GAME_DATA_UPDATED);
    } catch (e) {
      console.error("onDoneLoading error:", e);
    }
  }, []);

  // initialize Phaser + fetch game data — run when id changes
  useLayoutEffect(() => {
    if (!id) return;

    // register listener (use the same function ref so we can remove it later)
    EventBus.on(eventNames.DONE_LOADING, onDoneLoading);

    let destroyed = false;

    fetchGameData(id)
      .then(data => {
        if (destroyed) return;
        setGameData(data);
        if (!data) return;

        console.log("Fetched game for id", id, ":", data);

        // createGame should return a Phaser.Game instance
        // store it on the ref so we can destroy later
        phaserRef.current = createGame("game-container");
      })
      .catch(err => {
        console.error("Failed to fetch game data:", err);
      });

    return () => {
      destroyed = true;

      // Destroy Phaser game if it exists
      if (phaserRef.current) {
        try {
          phaserRef.current.destroy(true);
        } catch (e) {
          console.warn("Phaser destroy error:", e);
        }
        phaserRef.current = null;
      }

      // remove only the listener we added (preferred to removeAllListeners)
      try {
        EventBus.off(eventNames.DONE_LOADING, onDoneLoading);
      } catch {
        // fallback — if your EventBus doesn't support off, you can removeAllListeners
        try {
          EventBus.removeAllListeners();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [id, onDoneLoading]);

  return (
    <div className="fullScreen bg-gradient" style={{ width: "100%", height: "100%" }}>
      <h1 style={{ margin: 8 }}>Game #{id}</h1>
      <div id="game-container" style={{ width: "100%", height: "calc(100% - 48px)" }} />
    </div>
  );
}
