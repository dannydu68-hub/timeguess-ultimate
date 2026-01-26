/**
 * PauseScene.js
 * Menu pause avec image personnalisée et boutons dorés
 */

class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
        this.blurEffect = null;
    }

    preload() {
        if (!this.textures.exists('fenetre_pause')) {
            this.load.image('fenetre_pause', 'assets/images/fenetre_pause.png?v=107');
        }
        if (!this.textures.exists('btn_pause_new')) {
            this.load.image('btn_pause_new', 'assets/images/btn_pause_new.png?v=110');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const texts = {
            fr: { title: 'PAUSE', resume: 'REPRENDRE', menu: 'MENU' },
            en: { title: 'PAUSE', resume: 'RESUME', menu: 'MENU' },
            de: { title: 'PAUSE', resume: 'FORTSETZEN', menu: 'MENÜ' }
        };
        const t = texts[lang] || texts.fr;
        
        this.scene.bringToTop();
        
        // === EFFET DE FLOU SUR GAMESCENE ===
        this.applyBlurToGameScene();
        
        // === OVERLAY SOMBRE ===
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.overlay.setInteractive();
        this.overlay.setDepth(1000);
        
        // === MODALE ===
        this.modal = this.add.container(width / 2, height / 2);
        this.modal.setDepth(1001);
        
        // Image du cadre pause (nouvelle fenêtre)
        const frame = this.add.image(0, 0, 'fenetre_pause');
        frame.setScale(0.55);
        this.modal.add(frame);
        
        // Titre PAUSE - plus visible
        const titleText = this.add.text(0, -145, t.title, {
            fontSize: '32px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        this.modal.add(titleText);
        
        // === BOUTONS DORÉS ===
        this.createGoldButton(0, -30, t.resume, () => {
            this.closeModal();
        });
        
        this.createGoldButton(0, 70, t.menu, () => {
            this.removeBlurFromGameScene();
            this.scene.stop('GameScene');
            this.scene.stop();
            this.scene.start('MenuScene');
        });
        
        // === ANIMATIONS ===
        this.modal.setScale(0.8);
        this.modal.setAlpha(0);
        
        this.tweens.add({
            targets: this.overlay,
            alpha: 0.5,
            duration: 200
        });
        
        this.tweens.add({
            targets: this.modal,
            scale: 1,
            alpha: 1,
            duration: 250,
            ease: 'Back.out'
        });
        
        // Touche Echap
        this.input.keyboard.on('keydown-ESC', () => {
            this.closeModal();
        });
    }
    
    applyBlurToGameScene() {
        const gameScene = this.scene.get('GameScene');
        if (gameScene && gameScene.cameras && gameScene.cameras.main) {
            const camera = gameScene.cameras.main;
            // Utiliser postFX si disponible (Phaser 3.60+)
            if (camera.postFX) {
                // addBlur(quality, x, y, strength, color, steps)
                this.blurEffect = camera.postFX.addBlur(1, 4, 4, 1);
            }
        }
    }
    
    removeBlurFromGameScene() {
        const gameScene = this.scene.get('GameScene');
        if (gameScene && gameScene.cameras && gameScene.cameras.main) {
            const camera = gameScene.cameras.main;
            if (camera.postFX && this.blurEffect) {
                camera.postFX.remove(this.blurEffect);
                this.blurEffect = null;
            }
        }
    }
    
    closeModal() {
        this.tweens.add({
            targets: [this.modal, this.overlay],
            alpha: 0,
            scale: 0.9,
            duration: 150,
            ease: 'Power2',
            onComplete: () => {
                this.removeBlurFromGameScene();
                const gameScene = this.scene.get('GameScene');
                if (gameScene && gameScene.resumeGame) {
                    gameScene.resumeGame();
                }
                this.scene.stop();
                this.scene.resume('GameScene');
            }
        });
    }

    createGoldButton(x, y, text, callback) {
        const container = this.add.container(x, y);
        
        // Nouveau bouton doré
        const btnImg = this.add.image(0, 0, 'btn_pause_new');
        btnImg.setScale(0.35);
        container.add(btnImg);
        
        // Texte centré - très lisible
        const label = this.add.text(0, 0, text, {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#5D4E37',
            stroke: '#FFD700',
            strokeThickness: 2
        }).setOrigin(0.5);
        container.add(label);
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 320, 70, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);
        
        // Hover
        hitArea.on('pointerover', () => {
            container.setScale(1.08);
            label.setColor('#3D2E17');
        });
        
        hitArea.on('pointerout', () => {
            container.setScale(1);
            label.setColor('#5D4E37');
        });
        
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) {
                this.game.soundManager.playClickSound();
            }
            container.setScale(0.95);
        });
        
        hitArea.on('pointerup', () => {
            container.setScale(1.08);
            callback();
        });
        
        this.modal.add(container);
        
        return container;
    }
}

window.PauseScene = PauseScene;
