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


function fetchGame(id: number, setGame: (value: Game) => void) {
    fetch(`http://localhost:5000/api/game-${id}`) 
        .then(res => {
            if (!res.ok) throw new Error("Rejected request --.");
            return res.json();
        })
        .then(g => {
            console.log("Game received:");
            console.log(g);
            setGame(g);
        })
        .catch(console.error);
}


export default function GamePage(): ReactElement {

    const [game, setGame] = useState<Game>();
    const [idText, setIdText] = useState<string>("");

    return (
        <div>
            <h1>Game</h1>
            <p>{JSON.stringify(game)}</p>
            <TextInput id="idText" label="Game ID" value={idText} setValue={setIdText} />
            <button type="button" onClick={()=>fetchGame(+idText, setGame)}>Get Game</button>
        </div>
    );
}