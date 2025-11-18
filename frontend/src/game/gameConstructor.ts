import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import MainScene from './scenes/MainScene';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Preloader,
        MainScene
    ]
};

export default function createGame(parent: string) {
    return new Game({ ...config, parent });
}
