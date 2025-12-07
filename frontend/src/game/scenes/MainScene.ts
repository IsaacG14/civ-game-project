import { EventBus } from "../EventBus";
import { Game, GameObjects } from 'phaser';
import { GAME_DATA_KEY, GameData } from "../../constants";

export default class MainScene extends Phaser.Scene {

    private background: GameObjects.Image;
    private logo: GameObjects.Image;
    private title: GameObjects.Text;

    constructor() {
        super('MainScene');
    }

    create() {
        this.background = this.add.image(512, 384, 'background');

        this.logo = this.add.image(512, 300, 'logo').setDepth(100);

        const gameData : GameData = this.registry.get("gameData");

        this.title = this.add.text(512, 460, "", {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);
        
        this.registry.events.on('changedata-' + GAME_DATA_KEY, this.updateScene, this);
        this.registry.events.on('destroy', () => {
            this.registry.events.off('changedata-' + GAME_DATA_KEY, this.updateScene);
        })

        this.updateScene(this.game, gameData);

        EventBus.emit('current-scene-ready', this);
    }

    private updateScene(game: Game, value?: GameData, previousValue?: GameData) {
        this.title?.setText(value ? [`gameID = ${value.gameID}`, `name = ${value.name}`] : ["no game data"]);
    }


    /*

    logoTween: Phaser.Tweens.Tween | null;
    
    changeScene()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo(callback: (x: number, y: number) => void) 
    {
        const tween = this.logoTween;
        if (tween) 
        {
            tween.isPlaying() ? tween.pause() : tween.play();
        } 
        else 
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (callback) {
                        callback(Math.floor(this.logo.x), Math.floor(this.logo.y));
                    }
                }
            });
        }
    }

    */

    /* 
    
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;

    create()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameText = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    */
}