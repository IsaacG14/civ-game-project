export interface GameData {
    counts_towards_leaderboard: number;
    creation_date: string;
    game_id: number;
    name: string;
    start_date: string;
    status: string;
    type_name: string; // match API exactly
}

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
