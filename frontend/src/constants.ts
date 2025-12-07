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


export const eventNames = {
    DONE_LOADING: Symbol('event-done-loading'),
    GAME_DATA_UPDATED: Symbol('event-game-data-updated'),
};
Object.freeze(eventNames);


export const typeNames = {
    BLACKJACK: 'Blackjack',
    TICTACTOE: 'TicTacToe',
    WAR: 'War',
    ROSHAMBO: 'RoShamBo',
    UNO: 'Uno',
    CHECKERS: 'Checkers',
}
Object.freeze(typeNames);
