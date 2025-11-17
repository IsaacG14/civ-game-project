export type GameData = {
    gameID: number;
    typeName: string;
    name: string;
    creationDate: Date;
    startDate: Date;
    countsTowardLeaderboard: boolean;
    status: 'Unstarted' | 'Ongoing' | 'Finished';
};

export const GAME_DATA_KEY = "game-data";
