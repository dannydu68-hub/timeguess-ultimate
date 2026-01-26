/**
 * DifficultyScene.js
 * Sélection de difficulté avec boutons images personnalisés
 */

class DifficultyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyScene' });
    }

    init(data) {
        this.playerName = data.playerName || 'Joueur';
        this.selectedCategory = data.category || 'mixte';
        this.gameMode = data.mode || 'classic';
    }

    preload() {
        // Charger le fond si pas déjà chargé
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/images/background.png?v=107');
        }
        // Charger le cadre pour le titre
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
        // Charger le bouton retour
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        // Charger les boutons de difficulté selon la langue
        const lang = this.game.lang?.getLanguage() || 'fr';
        
        // Nouveaux boutons de difficulté avec blasons
        this.load.image('diff_btn_easy', 'assets/images/diff_btn_easy.png?v=127');
        this.load.image('diff_btn_normal', 'assets/images/diff_btn_normal.png?v=127');
        this.load.image('diff_btn_hard', 'assets/images/diff_btn_hard.png?v=127');
        this.load.image('diff_btn_extreme', 'assets/images/diff_btn_extreme.png?v=127');
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        this.progression = this.game.progression;
        
        this.createBackground(width, height);
        this.createTitle(width);
        this.createDifficultyCards(width, height);
        this.createBackButton();
        
        this.cameras.main.fadeIn(300);
    }

    createBackground(width, height) {
        // Image de fond (même que le menu)
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);

        // Particules subtiles
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(20, width - 20);
            const y = Phaser.Math.Between(80, height - 20);
            const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xFFFFFF, Phaser.Math.FloatBetween(0.1, 0.3));
            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.05 },
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    createTitle(width) {
        const title = this.lang.t('difficulty_title');
        
        // Créer d'abord le texte pour mesurer sa largeur
        const titleText = this.add.text(width / 2, 82, title, {
            fontSize: '24px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Calculer l'échelle du cadre basée sur la largeur du texte
        const textWidth = titleText.width;
        const minScale = 0.30;
        const maxScale = 0.50;
        const baseWidth = 400;
        const frameScale = Math.min(maxScale, Math.max(minScale, (textWidth + 80) / baseWidth * 0.38));
        
        // Cadre titre doré adaptatif
        const frame = this.add.image(width / 2, 85, 'frame_pseudo_new');
        frame.setScale(frameScale);
        frame.setDepth(0);
        titleText.setDepth(1);
    }

    createDifficultyCards(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';

        const diffNames = {
            fr: { easy: 'FACILE', normal: 'NORMAL', hard: 'DIFFICILE', expert: 'EXTRÊME' },
            en: { easy: 'EASY', normal: 'NORMAL', hard: 'HARD', expert: 'EXTREME' },
            de: { easy: 'LEICHT', normal: 'NORMAL', hard: 'SCHWER', expert: 'EXTREM' }
        };
        const names = diffNames[lang] || diffNames.fr;

        const diffDescs = {
            fr: { easy: '± 5 ans', normal: '± 3 ans', hard: '± 1 an', expert: 'Exact !' },
            en: { easy: '± 5 years', normal: '± 3 years', hard: '± 1 year', expert: 'Exact!' },
            de: { easy: '± 5 Jahre', normal: '± 3 Jahre', hard: '± 1 Jahr', expert: 'Exakt!' }
        };
        const descs = diffDescs[lang] || diffDescs.fr;

        const difficulties = [
            { key: 'easy', image: 'diff_btn_easy', name: names.easy, desc: descs.easy, multiplier: 'x1', scale: 0.45 },
            { key: 'normal', image: 'diff_btn_normal', name: names.normal, desc: descs.normal, multiplier: 'x1.2', scale: 0.45 },
            { key: 'hard', image: 'diff_btn_hard', name: names.hard, desc: descs.hard, multiplier: 'x1.5', scale: 0.45 },
            { key: 'expert', image: 'diff_btn_extreme', name: names.expert, desc: descs.expert, multiplier: 'x2', scale: 0.50 }
        ];

        const spacing = 290;
        const startX = width / 2 - (difficulties.length - 1) * spacing / 2;
        const y = height / 2 + 20;

        difficulties.forEach((diff, index) => {
            const x = startX + index * spacing;
            this.createDifficultyButton(x, y, diff);
        });
    }

    createDifficultyButton(x, y, difficulty) {
        const container = this.add.container(x, y);

        // Image du bouton (blason avec zone bois en bas)
        const btnImage = this.add.image(0, 0, difficulty.image);
        btnImage.setScale(difficulty.scale);
        container.add(btnImage);

        // Nom de la difficulté - aligné comme NORMAL (dans la zone bois)
        const nameText = this.add.text(0, 55, difficulty.name, {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        container.add(nameText);

        // Description (marge de tolérance) - alignée
        const descText = this.add.text(0, 82, difficulty.desc, {
            fontSize: '15px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        container.add(descText);

        // Multiplicateur XP - baissé
        const multiBg = this.add.graphics();
        multiBg.fillStyle(0x000000, 0.6);
        multiBg.fillRoundedRect(-40, 125, 80, 28, 14);
        container.add(multiBg);
        
        const multiText = this.add.text(0, 139, `XP ${difficulty.multiplier}`, {
            fontSize: '14px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#4ECDC4',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(multiText);

        // Zone interactive - DANS le container avec position relative (0, 0)
        const hitArea = this.add.rectangle(0, 30, 220, 280, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.08);
        });

        hitArea.on('pointerout', () => {
            container.setScale(1);
        });

        hitArea.on('pointerdown', () => {
            container.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
        });

        hitArea.on('pointerup', () => {
            container.setScale(1.08);
            this.selectDifficulty(difficulty.key);
        });
    }

    createBackButton() {
        const btn = this.add.image(100, 50, 'btn_back_new');
        btn.setScale(0.22);
        btn.setInteractive({ useHandCursor: true });
        
        btn.on('pointerover', () => btn.setScale(0.25));
        btn.on('pointerout', () => btn.setScale(0.22));
        btn.on('pointerdown', () => {
            btn.setScale(0.20);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.cameras.main.fadeOut(250);
            this.time.delayedCall(250, () => {
                this.scene.start('ModeScene', { 
                    playerName: this.playerName,
                    category: this.selectedCategory
                });
            });
        });
    }

    selectDifficulty(difficultyKey) {
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('GameScene', {
                playerName: this.playerName,
                category: this.selectedCategory,
                difficulty: difficultyKey,
                mode: this.gameMode
            });
        });
    }
}

window.DifficultyScene = DifficultyScene;
