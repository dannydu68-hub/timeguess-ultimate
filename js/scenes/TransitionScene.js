/**
 * TransitionScene.js
 * Écran de transition entre les questions
 */

class TransitionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TransitionScene' });
    }

    init(data) {
        this.gameData = data;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fond sombre
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

        // Numéro de question
        const questionText = this.add.text(width / 2, height / 2 - 80, `QUESTION ${this.gameData.questionNumber + 1}/10`, {
            fontSize: '48px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0);

        // Score
        const scoreText = this.add.text(width / 2, height / 2, `Score: ${this.gameData.score}`, {
            fontSize: '32px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        // Vies
        const livesText = this.add.text(width / 2, height / 2 + 60, `❤️ ${this.gameData.lives}`, {
            fontSize: '32px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#FF0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        // Combo si > 0
        let comboText = null;
        if (this.gameData.combo > 1) {
            comboText = this.add.text(width / 2, height / 2 + 120, `🔥 COMBO X${this.gameData.combo}`, {
                fontSize: '28px',
                fontFamily: 'Arial Black, sans-serif',
                color: '#FF6600', stroke: '#000000', strokeThickness: 3,
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);
        }

        // Animations
        this.tweens.add({
            targets: questionText,
            alpha: 1,
            scale: 1.2,
            duration: 300,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: [scoreText, livesText],
            alpha: 1,
            duration: 300,
            delay: 200,
            ease: 'Power2'
        });

        if (comboText) {
            this.tweens.add({
                targets: comboText,
                alpha: 1,
                scale: 1.1,
                duration: 300,
                delay: 400,
                yoyo: true,
                repeat: 2,
                ease: 'Sine.easeInOut'
            });
        }

        // Retour au jeu après 1.5s
        this.time.delayedCall(1500, () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });
    }
}

window.TransitionScene = TransitionScene;
