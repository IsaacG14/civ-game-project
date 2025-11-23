import { GAME_DATA_KEY } from "../../constants";
import { EventBus } from "../EventBus";

type TTTState = {
    turn: 'x'|'o';
    spaces: ('x'|'o'|'.')[][];
};

export default class TicTacToeScene extends Phaser.Scene {

    constructor() {
        super('TicTacToeScene');
    }

    camera: Phaser.Cameras.Scene2D.Camera;

    gameState: TTTState;
    background: Phaser.GameObjects.Image;
    grid: Phaser.GameObjects.Image;
    gamePieces: Phaser.GameObjects.Sprite[][] = [[],[],[]];

    create()
    {
        const gameData = this.registry.get(GAME_DATA_KEY);
        const stateString = "..x.o..x.";

        const iconXPos = [300, 512, 724];
        const iconYPos = [180, 388, 580];

        const tempState = this.parseState(stateString);
        if (tempState !== null) {
            this.gameState = tempState;
        }
        else {
            console.error("could not parse stateString correctly: ", stateString);
        }

        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#125915');

        /*
        // gameText displays mouse position on click
        // see: https://docs.phaser.io/phaser/concepts/input
        const gameText = this.add.text(512, 384, 'x: -1\ny: -1', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.background = this.add.sprite(512, 384, 'background');
        this.background.setAlpha(0.5);
        this.background.setInteractive();
        this.background.on('pointerdown', () => {
            gameText.setText(
                `x: ${Math.round(this.game.input.mousePointer?.x ?? -1)}\ny: ${Math.round(this.game.input.mousePointer?.y ?? -1)}`
            );
        });
        */

        this.grid = this.add.image(512, 384, 'ttt-grid');
        this.grid.setScale(768/1024);

        for (let r = 0; r < 3; r++) {
            this.gamePieces[r].length = 3;

            for (let c = 0; c < 3; c++) {
                const symbol = this.gameState.spaces[r][c];
                if (symbol === '.') continue;
                
                let sprite;
                if (symbol === 'x') {
                    sprite = this.add.sprite(iconXPos[c], iconYPos[r], 'ttt-x')
                        .setScale(768/1024)
                        .setTint(0xf4eb8d);
                }
                else {
                    sprite = this.add.sprite(iconXPos[c], iconYPos[r], 'ttt-o')
                        .setScale(768/1024)
                        .setTint(0xfcc0c0);
                }

                this.gamePieces[r][c] = sprite;
            }
        }
    }

    private parseState(stateString: string): TTTState | null {
        if (stateString.length !== 9) return null;

        let spaces: ('x'|'o'|'.')[][] = [[], [], []];
        let i = 0;
        let xCount = 0;
        let oCount = 0;
        
        for (let c of stateString) {
            let row = spaces[Math.floor(i/3)];

            if (c === 'x') {
                row.push('x');
                xCount++;
            }
            else if (c === 'o') {
                row.push('o');
                oCount++;
            }
            else if (c === '.') {
                row.push('.');
            }
            else {
                return null;
            }
            i++;
        }

        let turn: ('x'|'o');
        if (xCount === oCount) {
            turn = 'x';
        }
        else if (xCount === oCount+1) {
            turn = 'o';
        }
        else {
            return null;
        }

        return { turn, spaces };
    }
}