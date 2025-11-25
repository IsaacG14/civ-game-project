import { GAME_DATA_KEY } from "../../constants";

type TTTState = {
    turn: 'x' | 'o';
    spaces: ('x' | 'o' | '.')[][];
};

export default class TicTacToeScene extends Phaser.Scene {

    constructor() {
        super('TicTacToeScene');
    }

    camera: Phaser.Cameras.Scene2D.Camera;
    gameState: TTTState;
    background: Phaser.GameObjects.Image;
    grid: Phaser.GameObjects.Image;
    gamePieces: Phaser.GameObjects.Sprite[][] = [[], [], []];

    
    iconXPos = [304, 512, 720];
    iconYPos = [193, 396, 588];

    
    statusText: Phaser.GameObjects.Text;
    restartButton: Phaser.GameObjects.Text;
    gameActive: boolean = true; // Locks the board when someone wins

    create() {
        //Camera and BG
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor('#125915');

        //Intialize Board State
        const gamedata = this.registry.get(GAME_DATA_KEY);
        const stateString = "........."; 
        this.gameState = this.parseState(stateString);

        this.grid = this.add.image(512, 384, 'ttt-grid');
        this.grid.setScale(768 / 1024);
        
        //Create UI (Status Text)
        this.statusText = this.add.text(512, 60, 'Turn: X', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        //Create UI (Restart Button) 
        this.restartButton = this.add.text(512, 700, 'RESTART GAME', {
            fontSize: '32px',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 10, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.restartGame())
        .setVisible(false);

        
        for (let r = 0; r < 3; r++) {
            this.gamePieces[r].length = 3;

            for (let c = 0; c < 3; c++) {
                
                //Create a HITBOX for this slot (Row r, Col c)
                //We create a rectangle shape, but make it transparent (alpha 0.01)
                //180x180 is an approximation of your grid cell size
                const hitBox = this.add.rectangle(this.iconXPos[c], this.iconYPos[r], 180, 180, 0xffffff, 0);

                //Make it clickable
                hitBox.setInteractive();
                hitBox.on('pointerdown', () => {
                    this.handlePieceClick(r, c);
                });

                //Render existing pieces (Your original logic)
                const symbol = this.gameState.spaces[r][c];
                
                if (symbol !== '.') {
                    this.renderPiece(r, c, symbol);
                }
            }
        }
    }

/**
     * Main Game Logic: Handles clicking a square
     */
    private handlePieceClick(r: number, c: number) {
        //Don't act if game is over or space is taken
        if (!this.gameActive || this.gameState.spaces[r][c] !== '.') return;

        //Update Internal State
        const currentTurn = this.gameState.turn;
        this.gameState.spaces[r][c] = currentTurn;

        //Render Visuals
        this.renderPiece(r, c, currentTurn);

        //Check Win Condition
        if (this.checkWin(currentTurn)) {
            this.endGame(`${currentTurn.toUpperCase()} Wins!`);
            return;
        }

        //Check Draw Condition
        if (this.checkDraw()) {
            this.endGame("It's a Draw!");
            return;
        }

        //Swap Turn
        this.gameState.turn = (currentTurn === 'x') ? 'o' : 'x';
        this.statusText.setText(`Turn: ${this.gameState.turn.toUpperCase()}`);
    }

    /**
     * Checks all rows, cols, and diagonals for a win
     */
    private checkWin(player: 'x' | 'o'): boolean {
        const s = this.gameState.spaces;
        
        //Rows
        for (let i = 0; i < 3; i++) {
            if (s[i][0] === player && s[i][1] === player && s[i][2] === player) return true;
        }
        //Columns
        for (let i = 0; i < 3; i++) {
            if (s[0][i] === player && s[1][i] === player && s[2][i] === player) return true;
        }
        //Diagonals
        if (s[0][0] === player && s[1][1] === player && s[2][2] === player) return true;
        if (s[0][2] === player && s[1][1] === player && s[2][0] === player) return true;

        return false;
    }

    private checkDraw(): boolean {
        //If no spaces are '.', it's a draw
        return !this.gameState.spaces.some(row => row.includes('.'));
    }

    private endGame(message: string) {
        this.gameActive = false;
        this.statusText.setText(message);
        this.restartButton.setVisible(true);
    }

    private restartGame() {
        //Reset Logic
        this.gameState = this.parseState(".........");
        this.gameActive = true;
        this.statusText.setText("Turn: X");
        this.restartButton.setVisible(false);

        //Clear visual sprites
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (this.gamePieces[r][c]) {
                    this.gamePieces[r][c].destroy();
                    //@ts-ignore
                    this.gamePieces[r][c] = null;
                }
            }
        }
    }

    /**
     * Draws the X or O sprite at specific coordinates
     */
    private renderPiece(r: number, c: number, symbol: 'x'|'o') {
        let sprite;
        if (symbol === 'x') {
            sprite = this.add.sprite(this.iconXPos[c], this.iconYPos[r], 'ttt-x')
                .setScale(768 / 1024)
                .setTint(0xf4eb8d);
        } else {
            sprite = this.add.sprite(this.iconXPos[c], this.iconYPos[r], 'ttt-o')
                .setScale(768 / 1024)
                .setTint(0xfcc0c0);
        }
        this.gamePieces[r][c] = sprite;
    }

    private parseState(stateString: string): TTTState {
        if (stateString.length !== 9) {
            throw new Error(`TicTacToe stateString must contain 9 characters.`);
        }
        
        let spaces: ('x'|'o'|'.')[][] = [[], [], []];
        let i = 0;
        let xCount = 0;
        let oCount = 0;
        
        for (let c of stateString) {
            let row = spaces[Math.floor(i/3)];
            //@ts-ignore
            row.push(c);
            if (c === 'x') xCount++;
            if (c === 'o') oCount++;
            i++;
        }

        const turn = xCount <= oCount ? 'x' : 'o';
        return { turn, spaces };
    }
}