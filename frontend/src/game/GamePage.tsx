import { ReactElement, useState } from "react";
import TextInput from "../components/TextInput";

type Game = {
    gameID: number;
    typeName: string;
    name: string;
    creationDate: Date;
    startDate: Date;
    countsTowardLeaderboard: boolean;
    status: 'Unstarted' | 'Ongoing' | 'Finished';
};


async function fetchGame(id: number, setGame: (value: Game | undefined) => void) {

    const res = await fetch(`http://localhost:5000/api/game-${id}`);

    if (!res.ok) {
        console.error('Server responded with failure', res);
        if (res.status === 404) {
            setGame(undefined);
            return;
        }
        else {
            throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
    }

    const g = await res.json();
    setGame(g);
}


export default function GamePage(): ReactElement {

    const [game, setGame] = useState<Game>();
    const [idText, setIdText] = useState<string>("");

    return (
        <div>
            <h1>Game</h1>
            <p>{game ? (`${game.gameID}. ${game.name}: ${game.status} ${game.typeName} game`) : ""}</p>
            <TextInput id="idText" label="Game ID" value={idText} setValue={setIdText} />
            <button type="button" onClick={()=>fetchGame(+idText, setGame)}>Get Game</button>
        </div>
    );
}