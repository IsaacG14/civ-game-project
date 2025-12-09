// Preloader.ts
import { Scene } from 'phaser';
import { eventNames, GAME_DATA_KEY, GameData, typeNames } from '../../constants';
import { EventBus } from '../EventBus';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        // Progress bar outline
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(2, 0xffffff);

        // Progress bar itself
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        // Update progress bar on load progress
        this.load.on('progress', (progress: number) => {
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        this.load.image('logo', '/assets/logo.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('background', '/assets/bg.png');

        this.load.image('ttt-grid', '/assets/tictactoe/grid.png');
        this.load.image('ttt-x', '/assets/tictactoe/x-symbol.png');
        this.load.image('ttt-o', '/assets/tictactoe/o-symbol.png');

        // Optional: add other game assets here...
    }

    create() {
        console.log('Preload complete, gameData:', this.registry.get(GAME_DATA_KEY));

        // Immediately switch scene based on game type
        this.switchScene();
    }

    private switchScene() {
        const gameData: GameData = this.registry.get(GAME_DATA_KEY);
        if (!gameData) {
            console.error('No game data found in registry!');
            return;
        }

        console.log('Switching scene for game type:', gameData);

        switch (gameData.type_name) {
            case typeNames.BLACKJACK:
                this.scene.start('BlackJackScene');
                break;
            case typeNames.TICTACTOE:
                this.scene.start('TicTacToeScene');
                break;
            case typeNames.CHECKERS:
            case typeNames.ROSHAMBO:
            case typeNames.UNO:
            case typeNames.WAR:
                this.scene.start('MainScene');
                break;
            default:
                console.warn('Unknown game type, defaulting to MainScene');
                this.scene.start('MainScene');
        }
    }
}
