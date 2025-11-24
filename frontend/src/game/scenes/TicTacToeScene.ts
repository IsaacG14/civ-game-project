import { GAME_DATA_KEY } from "../../constants";

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
        const stateString = "..x.x.oo."; // TODO: get this from the database

        const iconXPos = [304, 512, 720];
        const iconYPos = [193, 396, 588];

        this.gameState = this.parseState(stateString);

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

    private parseState(stateString: string): TTTState {
        if (stateString.length !== 9) {
            throw new Error(`TicTacToe stateString must contain 9 characters. stateString=${stateString}`);
        }
        
        let spaces: ('x'|'o'|'.')[][] = [[], [], []];
        let i = 0;
        let xCount = 0;
        let oCount = 0;
        
        for (let c of stateString) {
            let row = spaces[Math.floor(i/3)];

            if (c !== 'x' && c !== 'o' && c !== '.') {
                throw new Error(`TicTacToe stateString must only include 'x', 'o', and '.' characters. Invalid character '${c}'.`);
            }

            row.push(c);
            if (c === 'x') xCount++;
            if (c === 'o') oCount++;
            i++;
        }

        const turn = xCount <= oCount ? 'x' : 'o';

        return { turn, spaces };
    }
}