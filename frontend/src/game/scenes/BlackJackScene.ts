import Phaser from "phaser";

type Card = {
    value: number;
    suit: string;
    name: string;
};

type BlackjackState = {
    playerCards: Card[];
    dealerCards: Card[];
    playerScore: number;
    dealerScore: number;
    gameActive: boolean;
};

export default class BlackjackScene extends Phaser.Scene {
    private state: BlackjackState;
    private playerText: Phaser.GameObjects.Text;
    private dealerText: Phaser.GameObjects.Text;
    private messageText: Phaser.GameObjects.Text;
    private restartButton: Phaser.GameObjects.Text;

    constructor() {
        super('BlackJackScene');
    }

    create() {
        // Initialize game state
        this.initGame();

        // UI Text
        this.playerText = this.add.text(512, 600, "", { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.dealerText = this.add.text(512, 200, "", { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
        this.messageText = this.add.text(512, 384, "", { fontSize: '32px', color: '#ffff00' }).setOrigin(0.5);

        // Buttons
        const hitButton = this.add.text(300, 700, "HIT", { fontSize: '32px', color: '#00ff00' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.hit());

        const standButton = this.add.text(700, 700, "STAND", { fontSize: '32px', color: '#ff0000' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.stand());

        this.restartButton = this.add.text(512, 500, "RESTART", { fontSize: '32px', color: '#ffff00', backgroundColor: '#000000', padding: { x: 10, y: 10 } })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.resetGame())
            .setVisible(false);

        this.updateUI();
    }

    private initGame() {
        this.state = {
            playerCards: [],
            dealerCards: [],
            playerScore: 0,
            dealerScore: 0,
            gameActive: true
        };

        // Deal initial cards
        this.state.playerCards.push(this.drawCard(), this.drawCard());
        this.state.dealerCards.push(this.drawCard());
        this.state.playerScore = this.calculateScore(this.state.playerCards);
        this.state.dealerScore = this.calculateScore(this.state.dealerCards);
    }

    private drawCard(): Card {
        const suits = ["♠", "♥", "♦", "♣"];
        const names = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
        const valueMap: Record<string, number> = { "A": 11, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "J":10, "Q":10, "K":10 };

        const suit = suits[Math.floor(Math.random()*4)];
        const name = names[Math.floor(Math.random()*13)];
        const value = valueMap[name];

        return { suit, name, value };
    }

    private calculateScore(cards: Card[]): number {
        let total = cards.reduce((sum, c) => sum + c.value, 0);
        let aces = cards.filter(c => c.name === "A").length;
        while(total > 21 && aces > 0){
            total -= 10; // Count Ace as 1 instead of 11
            aces--;
        }
        return total;
    }

    private updateUI() {
        this.playerText.setText(`Player: ${this.state.playerCards.map(c => c.name+c.suit).join(" ")} | Score: ${this.state.playerScore}`);
        this.dealerText.setText(`Dealer: ${this.state.dealerCards.map(c => c.name+c.suit).join(" ")} | Score: ${this.state.dealerScore}`);
    }

    private hit() {
        if (!this.state.gameActive) return;

        this.state.playerCards.push(this.drawCard());
        this.state.playerScore = this.calculateScore(this.state.playerCards);

        if (this.state.playerScore > 21) {
            this.endGame("Player Busts! Dealer Wins!");
        }
        this.updateUI();
    }

    private stand() {
        if (!this.state.gameActive) return;

        // Dealer hits until 17
        while(this.state.dealerScore < 17){
            this.state.dealerCards.push(this.drawCard());
            this.state.dealerScore = this.calculateScore(this.state.dealerCards);
        }

        // Determine winner
        let message = "";
        if (this.state.dealerScore > 21) message = "Dealer Busts! Player Wins!";
        else if (this.state.dealerScore > this.state.playerScore) message = "Dealer Wins!";
        else if (this.state.dealerScore < this.state.playerScore) message = "Player Wins!";
        else message = "Draw!";

        this.endGame(message);

        // Register win in database if player wins
        if (message.includes("Player Wins")) {
            this.registerWin();
        } 
        if (message.includes("Dealer Wins")) {
            this.registerLoss();
        } 

        this.updateUI();
    }

    private async registerWin() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await fetch("http://3.143.222.205:5000/api/update-stats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    type_name: "Blackjack",
                    result: "win"
                })
            });
        } catch (err) {
            console.error("Error updating stats:", err);
        }
    }
    private async registerLoss() {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            await fetch("http://3.143.222.205:5000/api/update-stats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    type_name: "Blackjack",
                    result: "loss"
                })
            });
        } catch (err) {
            console.error("Error updating stats:", err);
        }
    }

    private endGame(message: string) {
        this.state.gameActive = false;
        this.messageText.setText(message);
        this.restartButton.setVisible(true);
    }

    private resetGame() {
        this.initGame();
        this.messageText.setText("");
        this.restartButton.setVisible(false);
        this.updateUI();
    }
}
