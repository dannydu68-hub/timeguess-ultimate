/**
 * LanguageScene.js
 * Écran de sélection de langue au premier lancement
 */

class LanguageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LanguageScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/background.png?v=110');
        this.load.image('flag_fr_big', 'assets/images/flag_fr_big.png?v=145');
        this.load.image('flag_en_big', 'assets/images/flag_en_big.png?v=145');
        this.load.image('flag_de_big', 'assets/images/flag_de_big.png?v=145');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Fond d'écran (même que menu principal)
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        // Créer les 3 drapeaux - BEAUCOUP PLUS GRANDS
        this.createFlag(width / 2 - 320, height / 2, 'flag_fr_big', 'fr');
        this.createFlag(width / 2, height / 2, 'flag_en_big', 'en');
        this.createFlag(width / 2 + 320, height / 2, 'flag_de_big', 'de');

        // Animation d'entrée
        this.cameras.main.fadeIn(500);
    }

    createFlag(x, y, imageKey, lang) {
        const flag = this.add.image(x, y, imageKey);
        flag.setScale(1.1);
        flag.setInteractive({ useHandCursor: true });

        // Animation d'apparition
        flag.setAlpha(0);
        flag.setY(y + 50);
        this.tweens.add({
            targets: flag,
            alpha: 1,
            y: y,
            duration: 600,
            delay: lang === 'fr' ? 100 : (lang === 'en' ? 200 : 300),
            ease: 'Back.easeOut'
        });

        // Effet hover
        flag.on('pointerover', () => {
            this.tweens.add({
                targets: flag,
                scale: 1.25,
                duration: 200,
                ease: 'Quad.easeOut'
            });
        });

        flag.on('pointerout', () => {
            this.tweens.add({
                targets: flag,
                scale: 1.1,
                duration: 200,
                ease: 'Quad.easeOut'
            });
        });

        // Sélection de la langue
        flag.on('pointerdown', () => {
            this.selectLanguage(lang);
        });
    }

    selectLanguage(lang) {
        // Sauvegarder la langue
        localStorage.setItem('timeguess_language', lang);
        localStorage.setItem('timeguess_language_selected', 'true');

        // Initialiser le gestionnaire de langue
        if (!this.game.lang) {
            this.game.lang = new LanguageManager();
        }
        this.game.lang.setLanguage(lang);

        // Transition vers le menu
        this.cameras.main.fadeOut(400);
        this.time.delayedCall(400, () => {
            this.scene.start('MenuScene');
        });
    }
}

window.LanguageScene = LanguageScene;
