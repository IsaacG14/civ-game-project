import { ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import TextInput from "../components/TextInput";
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

        // add a listener to the done-loading event that calls onDoneLoading
        EventBus.on(eventNames.DONE_LOADING, onDoneLoading);

        fetchGameData(id)
        .then(g => {
            setGameData(g);
            if (g === undefined) return;

            phaserRef.current = createGame("game-container");
        });


        return () => {
            if (phaserRef.current) {
                phaserRef.current.destroy(true);
                phaserRef.current = null;
                EventBus.removeAllListeners();
            }
        }
    }, [id]);

    
    function onDoneLoading(scene_instance: Phaser.Scene): void {
        scene_instance.registry.set(GAME_DATA_KEY, gameDataRef.current);
        EventBus.emit(eventNames.GAME_DATA_UPDATED);
    }
    

    return (
        <div>
            <h1>Game</h1>

            {/* <TextInput id="idText" label="Game ID" value={idText} setValue={setIdText} /> */}

            <button type="button" onClick={_=>setId(+idText)}>Get Game</button>

            <p>{gameData ? (`${gameData.gameID}. ${gameData.name}: ${gameData.status} ${gameData.typeName} game`) : ""}</p>

            <div id="game-container"/>
            
            <button type="button" onClick={
                () => setGameData(x => x ? {...x} : undefined)
            }>Update Name</button>
        </div>
    );
}