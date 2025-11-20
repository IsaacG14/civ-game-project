import { Scene } from 'phaser';
import { eventNames, GAME_DATA_KEY, GameData, typeNames } from '../../constants';
import { EventBus } from '../EventBus';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });

        
        this.load.once("complete", () => {
            console.log("finished preload", this.registry.get(GAME_DATA_KEY));
            EventBus.emit(eventNames.DONE_LOADING, this);
        }, this);


        EventBus.on(eventNames.GAME_DATA_UPDATED, this.switchScene, this);
        EventBus.on('destroy', () => {
            EventBus.off(eventNames.GAME_DATA_UPDATED, this.switchScene);
        });
        EventBus.on('shutdown', () => {
            EventBus.off(eventNames.GAME_DATA_UPDATED, this.switchScene);
        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');
        this.load.image('background', 'bg.png');
    }

    switchScene() {
        const gameData: GameData = this.registry.get(GAME_DATA_KEY);

        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.
        
        //  Move to the next scene. You could also swap this for a Scene Transition, such as a camera fade.

        if (gameData.typeName === typeNames.BLACKJACK) {
            this.scene.start('MainScene');
        }
        else if (gameData.typeName === typeNames.CHECKERS) {
            this.scene.start('MainScene');
        }
        else if (gameData.typeName === typeNames.ROSHAMBO) {
            this.scene.start('MainScene');
        }
        else if (gameData.typeName === typeNames.TICTACTOE) {
            this.scene.start('TicTacToeScene');
        }
        else if (gameData.typeName === typeNames.UNO) {
            this.scene.start('MainScene');
        }
        else if (gameData.typeName === typeNames.WAR) {
            this.scene.start('MainScene');
        }
    }
}
