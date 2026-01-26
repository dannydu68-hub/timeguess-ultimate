/**
 * GlobalLeaderboardScene.js
 * Classement mondial avec design premium
 */

class GlobalLeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GlobalLeaderboardScene' });
    }

    init(data) {
        this.currentTab = data?.tab || 'all';
        this.currentMode = data?.mode || 'all';
    }

    preload() {
        if (!this.textures.exists('background_night')) {
            this.load.image('background_night', 'assets/images/background_night.png?v=107');
        }
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
        if (!this.textures.exists('frame_leaderboard')) {
            this.load.image('frame_leaderboard', 'assets/images/frame_leaderboard.png?v=107');
        }
        if (!this.textures.exists('btn_tab_gold_small')) {
            this.load.image('btn_tab_gold_small', 'assets/images/btn_tab_gold.png?v=110');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.lang = this.game.lang;
        this.firebase = this.game.firebase;
        this.progression = this.game.progression;
        
        this.createBackground(width, height);
        this.createBackButton();
        this.createHeader(width);
        this.createLeaderboardPanel(width, height);  // Panneau d'abord
        this.createTabs(width, height);  // Tabs ensuite (au-dessus)
        
        this.loadLeaderboard();
        
        this.cameras.main.fadeIn(300);
    }

    createBackground(width, height) {
        const bg = this.add.image(width / 2, height / 2, 'background_night');
        bg.setDisplaySize(width, height);

        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height);
            const star = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xFFFFFF, Phaser.Math.FloatBetween(0.1, 0.4));
            this.tweens.add({
                targets: star,
                alpha: 0.1,
                duration: Phaser.Math.Between(1500, 3000),
                yoyo: true,
                repeat: -1
            });
        }
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

    createHeader(width) {
        const lang = this.lang?.getLanguage() || 'fr';
        const titles = { fr: 'CLASSEMENT MONDIAL', en: 'WORLD RANKING', de: 'WELTRANGLISTE' };
        const loadingTexts = { fr: 'Chargement...', en: 'Loading...', de: 'Laden...' };
        
        const centerX = width / 2 + 70;  // Centré au-dessus du panneau
        const title = titles[lang] || titles.fr;
        
        // Créer d'abord le texte pour mesurer sa largeur
        const titleText = this.add.text(centerX, 68, title, {
            fontSize: '24px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Calculer l'échelle du cadre basée sur la largeur du texte
        const textWidth = titleText.width;
        const minScale = 0.42;
        const maxScale = 0.60;
        const baseWidth = 400;
        const frameScale = Math.min(maxScale, Math.max(minScale, (textWidth + 100) / baseWidth * 0.46));
        
        // Cadre titre doré adaptatif
        const titleFrame = this.add.image(centerX, 75, 'frame_pseudo_new');
        titleFrame.setScale(frameScale);
        titleFrame.setDepth(0);
        titleText.setDepth(1);
        
        // Stats globales - monté sous le titre dans le cadre
        this.statsText = this.add.text(centerX, 95, loadingTexts[lang] || loadingTexts.fr, {
            fontSize: '12px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.statsText.setDepth(1);
        
        this.loadGlobalStats();
    }

    async loadGlobalStats() {
        if (!this.firebase) return;
        
        const stats = await this.firebase.getGlobalStats();
        const lang = this.lang?.getLanguage() || 'fr';
        const { width } = this.cameras.main;
        
        if (stats) {
            const statsTexts = {
                fr: `${stats.totalGames} parties • ${stats.totalPlayers} joueurs`,
                en: `${stats.totalGames} games • ${stats.totalPlayers} players`,
                de: `${stats.totalGames} Spiele • ${stats.totalPlayers} Spieler`
            };
            this.statsText.setText(statsTexts[lang] || statsTexts.fr);
        }
    }

    createTabs(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        
        const tabLabels = {
            fr: { all: 'Tous', survival: 'Survie', daily: "Auj." },
            en: { all: 'All', survival: 'Survival', daily: 'Today' },
            de: { all: 'Alle', survival: 'Überleben', daily: 'Heute' }
        };
        const labels = tabLabels[lang] || tabLabels.fr;
        
        const tabs = [
            { key: 'all', label: labels.all, icon: '🏆' },
            { key: 'classic', label: 'Classic', icon: '🎮' },
            { key: 'survival', label: labels.survival, icon: '💀' },
            { key: 'timeattack', label: 'Chrono', icon: '⏱️' },
            { key: 'duel', label: 'Duel', icon: '⚔️' },
            { key: 'daily', label: labels.daily, icon: '📅' }
        ];

        const x = 115;
        const startY = 190;
        const spacing = 70;

        tabs.forEach((tab, index) => {
            const y = startY + index * spacing;
            const isActive = tab.key === this.currentTab;
            
            // Cadre de l'onglet - taille réduite
            const tabFrame = this.add.image(x, y, 'btn_tab_gold_small');
            tabFrame.setScale(0.28);
            tabFrame.setDepth(20);
            tabFrame.setAlpha(isActive ? 1 : 0.6);
            
            // Label
            const label = this.add.text(x, y, `${tab.icon} ${tab.label}`, {
                fontSize: '14px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(21);
            label.setAlpha(isActive ? 1 : 0.7);
            
            // Zone cliquable
            const clickZone = this.add.rectangle(x, y, 160, 55, 0x000000, 0);
            clickZone.setDepth(100);
            clickZone.setInteractive({ useHandCursor: true });
            
            clickZone.on('pointerover', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.9);
                    label.setAlpha(1);
                }
            });
            clickZone.on('pointerout', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.6);
                    label.setAlpha(0.7);
                }
            });
            clickZone.on('pointerdown', () => {
                if (this.game.soundManager) this.game.soundManager.playClickSound();
                if (tab.key !== this.currentTab) {
                    this.scene.restart({ tab: tab.key });
                }
            });
        });
    }

    createLeaderboardPanel(width, height) {
        const panelX = width / 2 + 70;  // Position normale
        const panelY = 160;  // Plus bas
        const panelW = 820;
        const panelH = height - 220;  // Plus petit
        
        this.panelBounds = { x: panelX, y: panelY, w: panelW, h: panelH };
        
        // Cadre doré
        const frameLeaderboard = this.add.image(panelX, panelY + panelH/2, 'frame_leaderboard');
        frameLeaderboard.setDisplaySize(panelW + 100, panelH + 80);
        
        // En-têtes - positionnés DANS le cadre
        const lang = this.lang?.getLanguage() || 'fr';
        const headerLabels = {
            fr: { player: 'Joueur', category: 'Cat.' },
            en: { player: 'Player', category: 'Cat.' },
            de: { player: 'Spieler', category: 'Kat.' }
        };
        const hLabels = headerLabels[lang] || headerLabels.fr;
        
        const headerY = panelY + 55;  // Headers plus hauts dans le cadre
        const headers = [
            { text: '#', x: panelX - 260 },
            { text: hLabels.player, x: panelX - 130 },
            { text: 'Score', x: panelX + 30 },
            { text: 'Mode', x: panelX + 130 },
            { text: hLabels.category, x: panelX + 220 },
            { text: 'Combo', x: panelX + 310 }
        ];
        
        headers.forEach(h => {
            this.add.text(h.x, headerY, h.text, {
                fontSize: '13px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
        });
        
        // Ligne de séparation sous les en-têtes
        const separatorLine = this.add.graphics();
        separatorLine.lineStyle(2, 0x5D4E37, 0.6);
        separatorLine.lineBetween(panelX - 320, headerY + 18, panelX + 340, headerY + 18);
        
        // Masque pour le scroll - Zone très restrictive
        const maskTop = headerY + 50;  // Beaucoup plus bas
        const maskBottom = panelY + panelH - 80;
        const maskHeight = maskBottom - maskTop;
        
        const maskShape = this.add.graphics();
        maskShape.fillStyle(0xFFFFFF);
        maskShape.fillRect(panelX - 320, maskTop, 660, maskHeight);
        maskShape.setVisible(false);
        
        const mask = maskShape.createGeometryMask();
        
        // Stocker les limites pour le scroll
        this.maskTop = maskTop;
        this.maskHeight = maskHeight;
        
        // Container pour les scores
        this.scoresContainer = this.add.container(0, 0);
        this.scoresContainer.setMask(mask);
        
        // Texte de chargement
        const loadingTexts = { fr: '⏳ Chargement...', en: '⏳ Loading...', de: '⏳ Laden...' };
        this.loadingText = this.add.text(panelX, panelY + panelH/2, loadingTexts[lang] || loadingTexts.fr, {
            fontSize: '24px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
    }

    async loadLeaderboard() {
        if (!this.firebase) {
            this.showError();
            return;
        }
        
        try {
            let scores;
            
            if (this.currentTab === 'all') {
                scores = await this.firebase.getLeaderboard('all', null, 50);
            } else if (this.currentTab === 'daily') {
                scores = await this.firebase.getDailyLeaderboard(50);
            } else {
                scores = await this.firebase.getLeaderboard('mode', this.currentTab, 50);
            }
            
            this.loadingText.setVisible(false);
            this.displayScores(scores);
        } catch (error) {
            console.error('Erreur chargement classement:', error);
            this.showError();
        }
    }

    displayScores(scores) {
        const { width, height } = this.cameras.main;
        const panelX = width / 2 + 70;  // Même offset que le panneau
        const startY = this.maskTop + 8;
        const rowHeight = 26;
        const lang = this.lang?.getLanguage() || 'fr';
        
        if (scores.length === 0) {
            const noScoreTexts = { fr: 'Aucun score pour le moment !', en: 'No scores yet!', de: 'Noch keine Scores!' };
            this.scoresContainer.add(this.add.text(panelX, startY + 100, noScoreTexts[lang] || noScoreTexts.fr, {
                fontSize: '20px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5));
            return;
        }

        const filteredScores = this.filterScores(scores);

        const modeNames = {
            fr: { classic: 'Classic', survival: 'Survie', timeattack: 'Chrono', duel: 'Duel', decade: 'Décennie' },
            en: { classic: 'Classic', survival: 'Survival', timeattack: 'Timed', duel: 'Duel', decade: 'Decade' },
            de: { classic: 'Classic', survival: 'Überleben', timeattack: 'Chrono', duel: 'Duel', decade: 'Jahrzehnt' }
        };
        const modes = modeNames[lang] || modeNames.fr;

        const categoryNames = {
            fr: { mixte: 'Mixte', musique: 'Musique', anime: 'Anime', culture: 'Culture', sport: 'Sport', cinema: 'Cinéma', jeux: 'Jeux', sciences: 'Sciences', geographie: 'Géo', insolite: 'Insolite' },
            en: { mixte: 'Mixed', musique: 'Music', anime: 'Anime', culture: 'Trivia', sport: 'Sports', cinema: 'Movies', jeux: 'Games', sciences: 'Science', geographie: 'Geo', insolite: 'Unusual' },
            de: { mixte: 'Gemischt', musique: 'Musik', anime: 'Anime', culture: 'Kultur', sport: 'Sport', cinema: 'Kino', jeux: 'Spiele', sciences: 'Wissen', geographie: 'Geo', insolite: 'Kurios' }
        };
        const categories = categoryNames[lang] || categoryNames.fr;

        const visibleScores = filteredScores.slice(0, Math.min(filteredScores.length, 50));
        
        for (let i = 0; i < visibleScores.length; i++) {
            const score = visibleScores[i];
            const y = startY + i * rowHeight;
            const rank = i + 1;
            
            // Fond alterné avec effet
            const rowBg = this.add.graphics();
            if (rank <= 3) {
                const colors = [0xFFD700, 0xC0C0C0, 0xCD7F32];
                rowBg.fillStyle(colors[rank - 1], 0.2);
            } else if (i % 2 === 0) {
                rowBg.fillStyle(0x8B7355, 0.12);
            }
            rowBg.fillRoundedRect(panelX - 310, y - 10, 640, rowHeight - 4, 5);
            this.scoresContainer.add(rowBg);
            
            // Médailles pour top 3
            let rankText = `${rank}`;
            let rankColor = '#2C1810';
            let rankSize = '12px';
            if (rank === 1) { rankText = '🥇'; rankColor = '#8B6914'; rankSize = '16px'; }
            else if (rank === 2) { rankText = '🥈'; rankColor = '#5A5A5A'; rankSize = '16px'; }
            else if (rank === 3) { rankText = '🥉'; rankColor = '#6B3810'; rankSize = '16px'; }
            
            // Rang
            this.scoresContainer.add(this.add.text(panelX - 260, y, rankText, {
                fontSize: rankSize,
                fontFamily: '"Arial Black", sans-serif',
                color: rankColor,
                stroke: '#FFFFFF',
                strokeThickness: 2
            }).setOrigin(0.5));
            
            // Nom du joueur
            const nameColor = rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#5D4E37';
            this.scoresContainer.add(this.add.text(panelX - 200, y, score.name || 'Anonyme', {
                fontSize: '12px',
                fontFamily: '"Arial Black", sans-serif',
                color: nameColor,
                stroke: '#FFFFFF',
                strokeThickness: 2
            }).setOrigin(0, 0.5));
            
            // Score
            this.scoresContainer.add(this.add.text(panelX + 30, y, score.score.toString(), {
                fontSize: '14px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5));
            
            // Mode
            this.scoresContainer.add(this.add.text(panelX + 130, y, modes[score.mode] || score.mode, {
                fontSize: '10px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#4ECDC4',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5));
            
            // Catégorie
            this.scoresContainer.add(this.add.text(panelX + 220, y, categories[score.category] || score.category, {
                fontSize: '10px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FF69B4',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5));
            
            // Combo
            this.scoresContainer.add(this.add.text(panelX + 310, y, `x${score.maxCombo || 0}`, {
                fontSize: '12px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FF6B6B',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5));
        }
        
        // Configurer le scroll
        const contentHeight = visibleScores.length * rowHeight;
        const visibleHeight = this.maskHeight - 20;  // Utiliser la hauteur du masque
        
        if (contentHeight > visibleHeight) {
            this.scrollY = 0;
            const maxScroll = contentHeight - visibleHeight + 20;
            
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
                this.scrollY += deltaY * 0.5;
                this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, maxScroll);
                this.scoresContainer.y = -this.scrollY;
            });
            
            let dragStartY = 0;
            let startScrollY = 0;
            
            this.input.on('pointerdown', (pointer) => {
                if (pointer.y > this.maskTop && pointer.y < this.maskTop + this.maskHeight) {
                    dragStartY = pointer.y;
                    startScrollY = this.scrollY;
                }
            });
            
            this.input.on('pointermove', (pointer) => {
                if (pointer.isDown && dragStartY !== 0) {
                    const delta = dragStartY - pointer.y;
                    this.scrollY = Phaser.Math.Clamp(startScrollY + delta, 0, maxScroll);
                    this.scoresContainer.y = -this.scrollY;
                }
            });
            
            this.input.on('pointerup', () => {
                dragStartY = 0;
            });
        }
    }
    
    filterScores(scores) {
        const playerCategoryCount = {};
        const filtered = [];
        
        for (const score of scores) {
            const key = `${(score.name || 'Anonyme').toLowerCase()}_${score.category || 'mixte'}`;
            playerCategoryCount[key] = (playerCategoryCount[key] || 0) + 1;
            
            if (playerCategoryCount[key] <= 2) {
                filtered.push(score);
            }
        }
        
        return filtered;
    }

    showError() {
        const lang = this.lang?.getLanguage() || 'fr';
        const errorTexts = { fr: '❌ Erreur de connexion', en: '❌ Connection error', de: '❌ Verbindungsfehler' };
        this.loadingText.setText(errorTexts[lang] || errorTexts.fr);
        this.loadingText.setColor('#FF6B6B');
    }
}

window.GlobalLeaderboardScene = GlobalLeaderboardScene;
