import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import TextInput from "../components/TextInput";
import createGame from "../game/gameConstructor";
import { EventBus } from "../game/EventBus";
import { GAME_DATA_KEY, GameData } from "../constants";



async function fetchGameData(id: number): Promise<GameData | undefined> {

    const res = await fetch(`http://localhost:5000/api/game-${id}`);

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

    const [idText, setIdText] = useState<string>("");
    const [id, setId] = useState<number>();
    
    const [gameData, setGameData] = useState<GameData>();
    const gameDataRef = useRef<GameData | undefined>(gameData);

    // this reference will survive across re-renders
    const phaserRef = useRef<Phaser.Game | null>(null);


    // Emit updated game data to Phaser whenever it changes
    useEffect(() => {
        gameDataRef.current = gameData;
        phaserRef.current?.registry.set(GAME_DATA_KEY, gameData);
    }, [gameData]);


    // useLayoutEffect is called after all previously scheduled DOM changes occur,
    // so we can rely on there being a game container element
    useLayoutEffect(() => {
        // this code is run every time the id changes

        if (id === undefined) return;

        fetchGameData(id)
        .then(g => {
            setGameData(g);
            if (g === undefined) return;

            phaserRef.current = createGame("game-container");
        });


        return () =>
        {
            if (phaserRef.current) {
                phaserRef.current.destroy(true);
                phaserRef.current = null;
            }
        }
    }, [id]);

    
    function onSceneReady(scene_instance: Phaser.Scene): void {
        const latest = gameDataRef.current;
        console.log(`React says scene is ready`, scene_instance);
        console.log(latest);
        scene_instance.registry.set(GAME_DATA_KEY, latest);
    }

    // add a listener to the current-scene-ready event that calls onSceneReady
    useEffect(() => {
        EventBus.on('current-scene-ready', onSceneReady);

        return () => { 
            EventBus.off('current-scene-ready', onSceneReady); 
        };
    }, []);
    

    return (
        <div>
            <h1>Game</h1>
            <TextInput id="idText" label="Game ID" value={idText} setValue={setIdText} />
            <button type="button" onClick={_=>setId(+idText)}>Get Game</button>
            <p>{gameData ? (`${gameData.gameID}. ${gameData.name}: ${gameData.status} ${gameData.typeName} game`) : ""}</p>
            <div id="game-container"/>
            <button type="button" onClick={() => setGameData(
                    x => (x === undefined) ? undefined : {...x, name: x.name+"a"}
                )}>Update Name</button>
        </div>
    );
}