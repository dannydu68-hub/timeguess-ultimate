/**
 * StatsScene.js
 * Écran de statistiques détaillées
 */

class StatsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StatsScene' });
    }

    preload() {
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;

        // Fond
        this.createBackground();

        // Titre avec cadre adaptatif
        const lang = this.lang?.getLanguage() || 'fr';
        const titles = { fr: 'STATISTIQUES', en: 'STATISTICS', de: 'STATISTIKEN' };
        const title = titles[lang] || titles.fr;
        
        // Créer d'abord le texte pour mesurer sa largeur
        const titleText = this.add.text(width / 2, 72, title, {
            fontSize: '24px',
            fontFamily: 'Arial Black, sans-serif',
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
        const titleFrame = this.add.image(width / 2, 75, 'frame_pseudo_new');
        titleFrame.setScale(frameScale);
        titleFrame.setDepth(0);
        titleText.setDepth(1);

        // Charge les stats
        const stats = this.loadStats();

        // Affiche les stats
        this.displayStats(stats, width, height);

        // Bouton retour
        this.createBackButton(width / 2, height - 80);
    }

    createBackground() {
        const { width, height } = this.cameras.main;
        
        for (let i = 0; i < 10; i++) {
            const radius = 100 + (i * 80);
            const alpha = 0.08 - (i * 0.008);
            const graphics = this.add.graphics();
            graphics.fillStyle(0x667EEA, alpha);
            graphics.fillCircle(width / 2, height / 2, radius);
        }
    }

    displayStats(stats, width, height) {
        const startY = 140;
        const lineHeight = 45;
        let currentY = startY;

        // Stats globales
        this.addStatLine('🎮 Parties jouées', stats.gamesPlayed, width / 2 - 300, currentY);
        this.addStatLine('🏆 Parties gagnées', stats.gamesWon, width / 2 + 100, currentY);
        currentY += lineHeight;

        this.addStatLine('💯 Score total', stats.totalScore, width / 2 - 300, currentY);
        this.addStatLine('🌟 Score max', stats.maxScore, width / 2 + 100, currentY);
        currentY += lineHeight;

        this.addStatLine('🔥 Combo max', stats.maxCombo, width / 2 - 300, currentY);
        this.addStatLine('⏱️ Meilleur temps', this.formatTime(stats.bestTime), width / 2 + 100, currentY);
        currentY += lineHeight;

        this.addStatLine('✅ Bonnes réponses', stats.correctAnswers, width / 2 - 300, currentY);
        this.addStatLine('❌ Mauvaises réponses', stats.wrongAnswers, width / 2 + 100, currentY);
        currentY += lineHeight + 20;

        // Taux de réussite
        const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
        const accuracy = (stats.correctAnswers + stats.wrongAnswers) > 0 ? 
            Math.round((stats.correctAnswers / (stats.correctAnswers + stats.wrongAnswers)) * 100) : 0;

        this.add.text(width / 2, currentY, `🎯 Taux de victoire: ${winRate}%`, {
            fontSize: '24px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#00FF00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        currentY += lineHeight;

        this.add.text(width / 2, currentY, `📈 Précision: ${accuracy}%`, {
            fontSize: '24px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#00AAFF',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        currentY += lineHeight + 30;

        // Meilleure catégorie
        const bestCat = this.getBestCategory(stats);
        if (bestCat) {
            this.add.text(width / 2, currentY, `🏅 Meilleure catégorie: ${bestCat}`, {
                fontSize: '20px',
                fontFamily: 'Arial, sans-serif',
                color: '#FFAA00',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
    }

    addStatLine(label, value, x, y) {
        this.add.text(x, y, `${label}: ${value}`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        });
    }

    formatTime(ms) {
        if (!ms || ms === Infinity) return 'N/A';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    getBestCategory(stats) {
        if (!stats.categories) return null;
        
        let best = null;
        let bestScore = 0;
        
        for (const cat in stats.categories) {
            const catStats = stats.categories[cat];
            if (catStats.won > bestScore) {
                bestScore = catStats.won;
                best = cat;
            }
        }
        
        const catNames = {
            musique: 'Musique',
            anime: 'Animé',
            culture: 'Culture Générale',
            insolite: 'Insolite',
            mixte: 'Mixte'
        };
        
        return catNames[best] || best;
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('timeline_stats');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.log('Erreur chargement stats');
        }
        
        return {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            maxScore: 0,
            maxCombo: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            bestTime: Infinity,
            categories: {},
            difficulties: {}
        };
    }

    createBackButton(x, y) {
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

window.StatsScene = StatsScene;
