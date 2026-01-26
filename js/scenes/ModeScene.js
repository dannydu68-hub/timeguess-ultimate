/**
 * ModeScene.js
 * Sélection du mode de jeu avec boutons images personnalisés
 */

class ModeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ModeScene' });
    }

    init(data) {
        this.playerName = data?.playerName || '';
        this.selectedCategory = data?.category || 'mixte';
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
        // Supprimer les anciennes textures de mode pour forcer le rechargement
        ['mode_classic', 'mode_survival', 'mode_timeattack', 'mode_duel', 'mode_decade'].forEach(key => {
            if (this.textures.exists(key)) {
                this.textures.remove(key);
            }
        });
        // Charger les nouveaux boutons de modes avec icônes intégrées (v112 - tailles normalisées)
        this.load.image('mode_classic', 'assets/images/mode_classic.png?v=114');
        this.load.image('mode_survival', 'assets/images/mode_survival.png?v=114');
        this.load.image('mode_timeattack', 'assets/images/mode_timeattack.png?v=114');
        this.load.image('mode_duel', 'assets/images/mode_duel.png?v=114');
        this.load.image('mode_decade', 'assets/images/mode_decade.png?v=114');
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        this.progression = this.game.progression;
        
        this.createBackground(width, height);
        this.createTitle(width);
        this.createModeCards(width, height);
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
        const title = this.lang.t('mode_title');
        
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

    createModeCards(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        
        const modeNames = {
            fr: { classic: 'Classique', survival: 'Survie', timeattack: 'Chrono', duel: 'Duel', decade: 'Décennie' },
            en: { classic: 'Classic', survival: 'Survival', timeattack: 'Time Attack', duel: 'Duel', decade: 'Decade' },
            de: { classic: 'Klassisch', survival: 'Überleben', timeattack: 'Zeitangriff', duel: 'Duell', decade: 'Jahrzehnt' }
        };
        const names = modeNames[lang] || modeNames.fr;

        const modeDescs = {
            fr: { 
                classic: '10 questions • 3 vies', 
                survival: '∞ questions • 3 vies', 
                timeattack: '60 secondes', 
                duel: 'VS IA • 3 vies',
                decade: 'Trouve la décennie'
            },
            en: { 
                classic: '10 questions • 3 lives', 
                survival: '∞ questions • 3 lives', 
                timeattack: '60 seconds', 
                duel: 'VS AI • 3 lives',
                decade: 'Find the decade'
            },
            de: { 
                classic: '10 Fragen • 3 Leben', 
                survival: '∞ Fragen • 3 Leben', 
                timeattack: '60 Sekunden', 
                duel: 'VS KI • 3 Leben',
                decade: 'Finde das Jahrzehnt'
            }
        };
        const descs = modeDescs[lang] || modeDescs.fr;

        const modes = [
            { key: 'classic', image: 'mode_classic', name: names.classic, desc: descs.classic },
            { key: 'survival', image: 'mode_survival', name: names.survival, desc: descs.survival },
            { key: 'timeattack', image: 'mode_timeattack', name: names.timeattack, desc: descs.timeattack },
            { key: 'duel', image: 'mode_duel', name: names.duel, desc: descs.duel },
            { key: 'decade', image: 'mode_decade', name: names.decade, desc: descs.decade }
        ];

        const buttonScale = 0.35;  // Agrandi pour que les descriptions tiennent dans les boutons
        const spacingX = 280;
        const spacingY = 160;
        
        // 3 cartes en haut, 2 en bas
        const row1 = modes.slice(0, 3);
        const row2 = modes.slice(3);
        
        const y1 = height / 2 - 50;
        const y2 = height / 2 + 130;
        
        // Ligne 1 (3 cartes)
        const startX1 = width / 2 - (row1.length - 1) * spacingX / 2;
        row1.forEach((mode, index) => {
            const x = startX1 + index * spacingX;
            this.createModeButton(x, y1, mode, buttonScale);
        });
        
        // Ligne 2 (2 cartes)
        const startX2 = width / 2 - (row2.length - 1) * spacingX / 2;
        row2.forEach((mode, index) => {
            const x = startX2 + index * spacingX;
            this.createModeButton(x, y2, mode, buttonScale);
        });
    }

    createModeButton(x, y, mode, scale) {
        const container = this.add.container(x, y);

        // Image du bouton (nouveau design avec icône intégrée sur le dessus)
        const btnImage = this.add.image(0, 0, mode.image);
        btnImage.setScale(scale);
        container.add(btnImage);

        // Nom du mode - centré sur la partie bois du bouton (texte blanc lisible)
        const nameText = this.add.text(0, 10, mode.name, {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        container.add(nameText);

        // Description - sous le nom
        const descText = this.add.text(0, 35, mode.desc, {
            fontSize: '12px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(descText);

        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 280, 140, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.1);
        });

        hitArea.on('pointerout', () => {
            container.setScale(1);
        });

        hitArea.on('pointerdown', () => {
            container.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
        });

        hitArea.on('pointerup', () => {
            container.setScale(1.1);
            this.selectMode(mode.key);
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
                this.scene.start('CategoryScene', { 
                    playerName: this.playerName
                });
            });
        });
    }

    selectMode(modeKey) {
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            // Mode Décennie: pas besoin de choisir la difficulté, aller directement au jeu
            if (modeKey === 'decade') {
                this.scene.start('GameScene', {
                    playerName: this.playerName,
                    category: this.selectedCategory,
                    mode: modeKey,
                    difficulty: 'normal' // Difficulté par défaut pour Décennie
                });
            } else {
                this.scene.start('DifficultyScene', {
                    playerName: this.playerName,
                    category: this.selectedCategory,
                    mode: modeKey
                });
            }
        });
    }
}

window.ModeScene = ModeScene;
