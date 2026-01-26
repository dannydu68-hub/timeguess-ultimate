/**
 * CategoryScene.js
 * Sélection de catégorie avec boutons images personnalisés
 */

class CategoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CategoryScene' });
    }

    init(data) {
        this.playerName = data.playerName || 'Joueur';
        this.gameMode = data.mode || 'classic';
    }

    preload() {
        // Charger le fond si pas déjà chargé
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/images/background.png?v=110');
        }
        // Charger le cadre pour le titre
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
        // Charger le bouton retour
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        // Charger le bouton tutoriel
        this.load.image('btn_tutorial_new', 'assets/images/btn_tutorial_new.png?v=110');
        
        // Charger les nouveaux boutons de catégories
        this.load.image('btn_cat_mixte', 'assets/images/btn_cat_mixte.png?v=110');
        this.load.image('btn_cat_musique', 'assets/images/btn_cat_musique.png?v=110');
        this.load.image('btn_cat_anime', 'assets/images/btn_cat_anime.png?v=110');
        this.load.image('btn_cat_culture', 'assets/images/btn_cat_culture.png?v=110');
        this.load.image('btn_cat_sport', 'assets/images/btn_cat_sport.png?v=110');
        this.load.image('btn_cat_cinema', 'assets/images/btn_cat_cinema.png?v=110');
        this.load.image('btn_cat_jeux', 'assets/images/btn_cat_jeux.png?v=110');
        this.load.image('btn_cat_sciences', 'assets/images/btn_cat_sciences.png?v=110');
        this.load.image('btn_cat_geographie', 'assets/images/btn_cat_geographie.png?v=110');
        this.load.image('btn_cat_insolite', 'assets/images/btn_cat_insolite.png?v=110');
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        this.progression = this.game.progression;
        
        this.createBackground(width, height);
        this.createTitle(width);
        this.createCategories(width, height);
        this.createTutorialButton(width, height);
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
        const title = this.lang.t('category_title');
        
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
        const baseWidth = 400; // Largeur de référence pour scale 0.38
        const frameScale = Math.min(maxScale, Math.max(minScale, (textWidth + 80) / baseWidth * 0.38));
        
        // Cadre titre doré adaptatif
        const frame = this.add.image(width / 2, 85, 'frame_pseudo_new');
        frame.setScale(frameScale);
        frame.setDepth(0);
        titleText.setDepth(1);
    }

    createCategories(width, height) {
        // Labels des catégories par langue
        const categoryLabels = {
            fr: {
                mixte: 'MIXTE', musique: 'MUSIQUE', anime: 'ANIME', culture: 'CULTURE',
                sport: 'SPORT', cinema: 'CINÉMA', jeux: 'JEUX VIDÉO', sciences: 'SCIENCES',
                geographie: 'GÉOGRAPHIE', insolite: 'INSOLITE'
            },
            en: {
                mixte: 'MIXED', musique: 'MUSIC', anime: 'ANIME', culture: 'CULTURE',
                sport: 'SPORTS', cinema: 'CINEMA', jeux: 'VIDEO GAMES', sciences: 'SCIENCE',
                geographie: 'GEOGRAPHY', insolite: 'UNUSUAL'
            },
            de: {
                mixte: 'GEMISCHT', musique: 'MUSIK', anime: 'ANIME', culture: 'KULTUR',
                sport: 'SPORT', cinema: 'KINO', jeux: 'VIDEOSPIELE', sciences: 'WISSENSCHAFT',
                geographie: 'GEOGRAPHIE', insolite: 'KURIOS'
            }
        };
        const lang = this.lang?.getLanguage() || 'fr';
        const labels = categoryLabels[lang] || categoryLabels.fr;
        
        const categories = [
            { key: 'mixte', image: 'btn_cat_mixte' },
            { key: 'musique', image: 'btn_cat_musique' },
            { key: 'anime', image: 'btn_cat_anime' },
            { key: 'culture', image: 'btn_cat_culture' },
            { key: 'sport', image: 'btn_cat_sport' },
            { key: 'cinema', image: 'btn_cat_cinema' },
            { key: 'jeux', image: 'btn_cat_jeux' },
            { key: 'sciences', image: 'btn_cat_sciences' },
            { key: 'geographie', image: 'btn_cat_geographie' },
            { key: 'insolite', image: 'btn_cat_insolite' }
        ];

        // Disposition: 3 lignes de 3 + 1 ligne de 1
        const buttonScale = 0.42;
        const spacingX = 380;
        const spacingY = 130; // Augmenté pour faire place aux labels
        const startY = 200;

        categories.forEach((cat, index) => {
            let x, y;
            
            if (index < 9) {
                // 3 lignes de 3
                const col = index % 3;
                const row = Math.floor(index / 3);
                x = width / 2 + (col - 1) * spacingX;
                y = startY + row * spacingY;
            } else {
                // Dernière ligne avec 1 seul bouton centré
                x = width / 2;
                y = startY + 3 * spacingY;
            }
            
            this.createCategoryButton(x, y, cat, buttonScale, labels[cat.key]);
        });
    }

    createCategoryButton(x, y, category, scale, label) {
        const container = this.add.container(x, y);
        
        // Image du bouton bannière avec design intégré
        const btnImage = this.add.image(0, 0, category.image);
        btnImage.setScale(scale);
        container.add(btnImage);
        
        // Label sous le bouton
        const labelText = this.add.text(0, 55, label, {
            fontSize: '12px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(labelText);

        // Zone interactive - DANS le container avec position relative (0, 0)
        const hitArea = this.add.rectangle(0, 0, 280, 90, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.08);
            labelText.setColor('#FFD700');
        });
        
        hitArea.on('pointerout', () => {
            container.setScale(1);
            labelText.setColor('#FFFFFF');
        });
        
        hitArea.on('pointerdown', () => {
            container.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
        });
        
        hitArea.on('pointerup', () => {
            container.setScale(1.1);
            this.selectCategory(category.key);
        });
    }

    selectCategory(categoryKey) {
        this.cameras.main.fadeOut(250);
        this.time.delayedCall(250, () => {
            this.scene.start('ModeScene', {
                playerName: this.playerName,
                category: categoryKey
            });
        });
    }
    
    createTutorialButton(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        const tutorialTexts = {
            fr: 'TUTORIEL',
            en: 'TUTORIAL',
            de: 'ANLEITUNG'
        };
        
        // Position en bas à gauche
        const x = 120;
        const y = height - 60;
        
        const container = this.add.container(x, y);
        
        // Image du bouton tutoriel (livre avec plume)
        const btnImg = this.add.image(0, 0, 'btn_tutorial_new');
        btnImg.setScale(0.35);
        container.add(btnImg);
        
        // Texte sous le bouton
        const label = this.add.text(0, 45, tutorialTexts[lang] || tutorialTexts.fr, {
            fontSize: '12px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(label);
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 140, 70, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);
        
        hitArea.on('pointerover', () => {
            container.setScale(1.1);
            label.setColor('#FFD700');
        });
        
        hitArea.on('pointerout', () => {
            container.setScale(1);
            label.setColor('#FFFFFF');
        });
        
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.goToTutorial();
        });
    }
    
    goToTutorial() {
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('TutorialScene', { playerName: this.playerName });
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
            this.time.delayedCall(250, () => this.scene.start('MenuScene'));
        });
    }
}

window.CategoryScene = CategoryScene;
