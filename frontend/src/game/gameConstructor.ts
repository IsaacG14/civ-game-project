import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import MainScene from './scenes/MainScene';
import TicTacToeScene from './scenes/TicTacToeScene';
import BlackJack from './scenes/BlackJackScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768, // 4:3 ratio
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Preloader,
        MainScene,
        TicTacToeScene,
        BlackJack
    ]
};

export default function createGame(parent: string) {
    return new Game({ ...config, parent });
}
