/**
 * GameScene.js - VERSION PREMIUM
 * Scène principale du jeu avec design professionnel
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.playerName = '';
        this.score = 0;
        this.lives = 3;
        this.combo = 0;
        this.maxCombo = 0;
        this.currentQuestion = null;
        this.questions = [];
        this.usedQuestions = [];
        this.timeline = null;
        this.marker = null;
        this.timeRemaining = 0;
        this.timerEvent = null;
        this.nextRoundTimer = null;
        this.soundManager = null;
        this.particleManager = null;
        this.achievementManager = null;
        this.statsManager = null;
        this.isValidating = false;
        this.selectedCategory = null;
        this.difficulty = 'normal';
        this.questionNumber = 0;
        this.gameStartTime = 0;
        this.gameMode = 'classic';
        this.correctAnswers = 0;
        this.globalTimeRemaining = 60;
        this.globalTimerEvent = null;
        this.globalTimerText = null;
    }

    init(data) {
        this.playerName = data.playerName || 'Joueur';
        this.selectedCategory = data.category || 'mixte';
        this.difficulty = data.difficulty || 'normal';
        this.gameMode = data.mode || 'classic';
        this.score = 0;
        this.lives = this.gameMode === 'timeattack' ? 999 : 3;
        this.combo = 0;
        this.maxCombo = 0;
        this.questionNumber = 0;
        this.usedQuestions = [];
        this.isValidating = false;
        this.correctAnswers = 0;
        this.globalTimeRemaining = 60;
    }

    preload() {
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/images/background.png?v=107');
        }
        if (!this.textures.exists('timeline')) {
            this.load.image('timeline', 'assets/images/timeline.png?v=107');
        }
        if (!this.textures.exists('cadre_date_gauche')) {
            this.load.image('cadre_date_gauche', 'assets/images/cadre_date_gauche.png?v=107');
        }
        if (!this.textures.exists('cadre_date_droite')) {
            this.load.image('cadre_date_droite', 'assets/images/cadre_date_droite.png?v=107');
        }
        if (!this.textures.exists('cursor')) {
            this.load.image('cursor', 'assets/images/cursor.png?v=107');
        }
        // Charger tous les curseurs alternatifs
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`cursor_${i}`)) {
                this.load.image(`cursor_${i}`, `assets/images/cursor_${i}.png`);
            }
        }
        if (!this.textures.exists('frame_panel')) {
            this.load.image('frame_panel', 'assets/images/frame_panel.png?v=107');
        }
        if (!this.textures.exists('frame_title')) {
            this.load.image('frame_title', 'assets/images/frame_title.png?v=107');
        }
        if (!this.textures.exists('btn_pause')) {
            this.load.image('btn_pause', 'assets/images/btn_pause.png?v=107');
        }
        if (!this.textures.exists('btn_validate')) {
            this.load.image('btn_validate', 'assets/images/btn_validate.png?v=107');
        }
        if (!this.textures.exists('frame_timer')) {
            this.load.image('frame_timer', 'assets/images/frame_timer.png?v=107');
        }
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=125');
        }
        // Boutons jokers
        if (!this.textures.exists('btn_joker_5050')) {
            this.load.image('btn_joker_5050', 'assets/images/btn_joker_5050.png?v=145');
        }
        if (!this.textures.exists('btn_joker_time')) {
            this.load.image('btn_joker_time', 'assets/images/btn_joker_time.png?v=145');
        }
        if (!this.textures.exists('btn_joker_skip')) {
            this.load.image('btn_joker_skip', 'assets/images/btn_joker_skip.png?v=145');
        }
        // Cadres UI
        if (!this.textures.exists('frame_lives')) {
            this.load.image('frame_lives', 'assets/images/frame_lives.png?v=107');
        }
        if (!this.textures.exists('frame_question')) {
            this.load.image('frame_question', 'assets/images/frame_question.png?v=107');
        }
        if (!this.textures.exists('frame_player_info')) {
            this.load.image('frame_player_info', 'assets/images/frame_player_info.png?v=107');
        }
        
        // Load avatar images
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`avatar_${i}`)) {
                this.load.image(`avatar_${i}`, `assets/images/avatars/avatar_${i}.png?v=107`);
            }
        }
    }

    async create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;

        if (!this.game.soundManager) {
            this.soundManager = new SoundManager(this);
            this.game.soundManager = this.soundManager;
        } else {
            this.soundManager = this.game.soundManager;
        }
        
        this.particleManager = new ParticleManager(this);
        this.achievementManager = new AchievementManager(this);
        this.statsManager = new StatsManager();
        this.gameStartTime = Date.now();

        await this.loadQuestions();
        this.createBackground(width, height);
        this.createUI(width, height);
        this.startRound();
    }

    async loadQuestions() {
        try {
            const lang = this.lang ? this.lang.getLanguage() : 'fr';
            let questionsFile = 'data/questions.json?v=107'; // Français par défaut
            if (lang === 'de') {
                questionsFile = 'data/questions_de.json?v=107';
            } else if (lang === 'en') {
                questionsFile = 'data/questions_en.json?v=107';
            }
            
            const response = await fetch(questionsFile);
            const allQuestions = await response.json();
            
            if (this.selectedCategory === 'mixte') {
                this.questions = allQuestions.filter(q => q.answers && q.answers.length > 0);
            } else {
                this.questions = allQuestions.filter(q => 
                    q.category && q.category.toLowerCase() === this.selectedCategory.toLowerCase() &&
                    q.answers && q.answers.length > 0
                );
                
                if (this.questions.length < 10) {
                    const otherQuestions = allQuestions.filter(q => 
                        q.category && q.category.toLowerCase() !== this.selectedCategory.toLowerCase() &&
                        q.answers && q.answers.length > 0
                    );
                    this.questions = [...this.questions, ...Phaser.Utils.Array.Shuffle(otherQuestions).slice(0, 10 - this.questions.length)];
                }
            }
            
            this.questions = Phaser.Utils.Array.Shuffle(this.questions);
        } catch (error) {
            console.error('Erreur chargement questions:', error);
            try {
                const response = await fetch('data/questions.json?v=107');
                const allQuestions = await response.json();
                this.questions = allQuestions.filter(q => q.answers && q.answers.length > 0);
            } catch (e) {
                console.error('Erreur chargement fallback:', e);
            }
        }
    }

    createBackground(width, height) {
        // Image de fond - même que le menu principal
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
        
        this.cameras.main.fadeIn(400);
    }

    createUI(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        
        // Catégories traduites
        const categoryNames = {
            fr: { mixte: 'Mixte', musique: 'Musique', anime: 'Anime', culture: 'Culture', sport: 'Sport', cinema: 'Cinéma', jeux: 'Jeux Vidéo', sciences: 'Sciences', geographie: 'Géographie', insolite: 'Insolite' },
            en: { mixte: 'Mixed', musique: 'Music', anime: 'Anime', culture: 'Culture', sport: 'Sports', cinema: 'Cinema', jeux: 'Video Games', sciences: 'Science', geographie: 'Geography', insolite: 'Unusual' },
            de: { mixte: 'Gemischt', musique: 'Musik', anime: 'Anime', culture: 'Kultur', sport: 'Sport', cinema: 'Kino', jeux: 'Videospiele', sciences: 'Wissenschaft', geographie: 'Geographie', insolite: 'Ungewöhnlich' }
        };
        const catNames = categoryNames[lang] || categoryNames.fr;
        
        // === PANNEAU GAUCHE - JOUEUR avec nouveau cadre - ABAISSÉ ===
        const playerInfoFrame = this.add.image(160, 75, 'frame_player_info');
        playerInfoFrame.setScale(0.22);
        
        // Avatar du joueur - centré avec pseudo, remonté
        const avatarKey = this.game.progression?.currentAvatar || 'avatar_4';
        if (this.textures.exists(avatarKey)) {
            const avatarImg = this.add.image(100, 55, avatarKey);
            avatarImg.setScale(0.14);
        }
        
        // Pseudo à côté de l'avatar - centré
        this.add.text(160, 55, this.playerName, {
            fontSize: '18px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0, 0.5);

        // Badge mode
        const modeNames = {
            fr: { classic: 'Classique', survival: 'Survie', timeattack: 'Chrono', duel: 'Duel', decade: 'Décennie' },
            en: { classic: 'Classic', survival: 'Survival', timeattack: 'Time Attack', duel: 'Duel', decade: 'Decade' },
            de: { classic: 'Klassisch', survival: 'Überleben', timeattack: 'Zeitangriff', duel: 'Duell', decade: 'Jahrzehnt' }
        };
        const modeTexts = modeNames[lang] || modeNames.fr;
        const modeColors = { classic: 0x667EEA, survival: 0xFF6B6B, timeattack: 0x00D9A5, duel: 0x9C27B0, decade: 0x00BCD4 };
        
        const modeBadge = this.add.graphics();
        modeBadge.fillStyle(modeColors[this.gameMode] || 0x667EEA, 1);
        modeBadge.fillRoundedRect(82, 88, 70, 20, 10);
        this.add.text(117, 98, modeTexts[this.gameMode] || this.gameMode, { fontSize: '9px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5);

        // Badge difficulté
        const diffNames = {
            fr: { easy: 'Facile', normal: 'Normal', hard: 'Difficile', expert: 'Expert' },
            en: { easy: 'Easy', normal: 'Normal', hard: 'Hard', expert: 'Expert' },
            de: { easy: 'Leicht', normal: 'Normal', hard: 'Schwer', expert: 'Experte' }
        };
        const diffTexts = diffNames[lang] || diffNames.fr;
        const diffColors = { easy: 0x00D9A5, normal: 0xFFAA00, hard: 0xFF6B6B, expert: 0xFF0000 };
        
        const diffBadge = this.add.graphics();
        diffBadge.fillStyle(diffColors[this.difficulty], 1);
        diffBadge.fillRoundedRect(158, 88, 60, 20, 10);
        this.add.text(188, 98, diffTexts[this.difficulty], { fontSize: '9px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2 }).setOrigin(0.5);

        // === MODE DUEL - Affichage IA ===
        if (this.gameMode === 'duel') {
            // Initialiser l'IA
            this.aiScore = 0;
            this.aiLives = 3;
            this.aiDifficulty = this.difficulty === 'easy' ? 0.5 : this.difficulty === 'hard' ? 0.85 : this.difficulty === 'expert' ? 0.95 : 0.7;
            
            // Panneau IA sous le cadre joueur (à gauche) - plus bas pour aérer
            const aiPanel = this.add.graphics();
            aiPanel.fillStyle(0x9C27B0, 0.7);
            aiPanel.fillRoundedRect(60, 145, 200, 45, 10);
            aiPanel.lineStyle(2, 0xBA68C8, 0.8);
            aiPanel.strokeRoundedRect(60, 145, 200, 45, 10);
            
            this.add.text(75, 167, '🤖 IA', {
                fontSize: '18px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0, 0.5);
            
            this.aiScoreText = this.add.text(160, 167, '0', {
                fontSize: '22px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFD700', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            
            this.aiLivesText = this.add.text(220, 167, '❤️❤️❤️', {
                fontSize: '14px'
            }).setOrigin(0.5);
        }

        // === PANNEAU DROITE - SCORE/VIES - Rapprochés du centre ===
        const livesFrame = this.add.image(width - 160, 60, 'frame_lives');
        livesFrame.setScale(0.22);

        // Score (rapproché du centre)
        const scoreLabel = (this.gameMode === 'classic' || this.gameMode === 'decade') ? `${this.correctAnswers}/10` : `${this.score}`;
        this.scoreText = this.add.text(width - 200, 60, scoreLabel, {
            fontSize: '26px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Vies (rapprochées du score)
        if (this.gameMode !== 'timeattack') {
            this.livesText = this.add.text(width - 110, 60, this.getLivesDisplay(), { fontSize: '20px' }).setOrigin(0.5);
        } else {
            this.globalTimerText = this.add.text(width - 110, 60, '60s', {
                fontSize: '20px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#00D9A5', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }
        
        // Bouton pause (bien en dessous du cadre)
        this.createPauseButton(width - 55, 140);

        // === PANNEAU QUESTION avec nouveau cadre fin ===
        const questionPanel = this.add.image(width / 2, 145, 'frame_question');
        questionPanel.setScale(0.52);

        this.categoryText = this.add.text(width / 2, 118, '', {
            fontSize: '16px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.questionText = this.add.text(width / 2, 148, '', {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#5D4E37',
            stroke: '#FFFFFF',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 620 }
        }).setOrigin(0.5);

        // === COMBO (dans le cadre question) ===
        this.comboText = this.add.text(width / 2, 180, '', {
            fontSize: '24px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FF6600', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setVisible(false);

        // === Plus de panneau autour de la timeline - elle est autonome ===

        // === TIMER avec nouveau cadre - CACHÉ en mode timeattack ===
        if (this.gameMode !== 'timeattack') {
            const timerFrame = this.add.image(width - 180, height - 135, 'frame_timer');
            timerFrame.setScale(0.18);
            
            // Timer centré sur le cadre
            this.timerText = this.add.text(width - 180, height - 135, '', {
                fontSize: '26px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
        }

        // === JOKERS ===
        this.createJokerButtons(width, height);

        // === BOUTONS ===
        this.createValidateButton(width / 2, height - 75);
        
        if (this.gameMode === 'timeattack') {
            this.startGlobalTimer();
        }
    }
    
    createJokerButtons(width, height) {
        const jokers = this.game.progression?.getJokers() || { fiftyFifty: 0, extraTime: 0, skip: 0 };
        const y = height - 115;
        
        this.jokerButtons = {};
        this.jokerHitAreas = {};
        this.jokersUsedThisGame = { fiftyFifty: false, extraTime: false, skip: false };
        
        // Jokers BEAUCOUP PLUS GRANDS et plus espacés
        const jokerData = [
            { key: 'fiftyFifty', image: 'btn_joker_5050', x: 100, count: jokers.fiftyFifty },
            { key: 'extraTime', image: 'btn_joker_time', x: 230, count: jokers.extraTime },
            { key: 'skip', image: 'btn_joker_skip', x: 360, count: jokers.skip }
        ];
        
        jokerData.forEach(joker => {
            const container = this.add.container(joker.x, y);
            const isAvailable = joker.count > 0;
            
            // Image du bouton - BEAUCOUP PLUS GRANDE
            const btnImage = this.add.image(0, 0, joker.image);
            btnImage.setScale(0.45);
            if (!isAvailable) {
                btnImage.setTint(0x666666);
                btnImage.setAlpha(0.5);
            }
            container.add(btnImage);
            
            // Compteur - repositionné pour le bouton plus grand
            const countBg = this.add.circle(50, -45, 18, isAvailable ? 0xFFD700 : 0x666666);
            container.add(countBg);
            const countText = this.add.text(50, -45, joker.count.toString(), {
                fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5);
            container.add(countText);
            
            // Stocker références pour mise à jour
            container.btnImage = btnImage;
            container.countBg = countBg;
            container.countText = countText;
            
            // Interaction - zone plus grande et centrée sur l'image
            if (isAvailable) {
                // Utiliser directement l'image comme zone interactive
                btnImage.setInteractive({ useHandCursor: true });
                
                btnImage.on('pointerover', () => {
                    if (!this.jokersUsedThisGame[joker.key]) {
                        container.setScale(1.1);
                    }
                });
                btnImage.on('pointerout', () => container.setScale(1));
                btnImage.on('pointerdown', () => {
                    if (!this.jokersUsedThisGame[joker.key] && !this.isValidating) {
                        this.useJoker(joker.key);
                    }
                });
                
                this.jokerHitAreas[joker.key] = btnImage;
            }
            
            this.jokerButtons[joker.key] = container;
        });
    }
    
    useJoker(type) {
        if (!this.game.progression?.useJoker(type)) return;
        if (this.game.soundManager) this.game.soundManager.playClickSound();
        
        this.jokersUsedThisGame[type] = true;
        
        // Désactiver visuellement le joker
        const container = this.jokerButtons[type];
        if (container) {
            // Griser le bouton
            container.setAlpha(0.3);
            container.setScale(1);
            
            // Mettre un X rouge sur le compteur
            if (container.countText) {
                container.countText.setText('✗');
                container.countText.setColor('#FF0000');
            }
            if (container.countBg) {
                container.countBg.setFillStyle(0x333333);
            }
        }
        
        // Désactiver le hit area
        if (this.jokerHitAreas[type]) {
            this.jokerHitAreas[type].disableInteractive();
        }
        
        switch(type) {
            case 'fiftyFifty':
                if (this.gameMode === 'decade') {
                    this.applyFiftyFiftyDecade();
                } else {
                    this.applyFiftyFifty();
                }
                break;
            case 'extraTime':
                this.applyExtraTime();
                break;
            case 'skip':
                this.applySkip();
                break;
        }
    }
    
    applyFiftyFifty() {
        // Réduire la timeline de moitié autour de la bonne réponse
        if (!this.currentQuestion || !this.timeline || !this.timeline.container) return;
        
        const answer = this.currentQuestion.answers[0];
        const correctYear = typeof answer === 'object' ? answer.value : answer;
        const currentMin = this.currentQuestion.timeline.min;
        const currentMax = this.currentQuestion.timeline.max;
        const range = currentMax - currentMin;
        
        // Nouvelle timeline = 50% de la taille, centrée sur la réponse
        const newRange = Math.max(15, Math.floor(range / 2));
        let newMin = correctYear - Math.floor(newRange / 2);
        let newMax = correctYear + Math.ceil(newRange / 2);
        
        // Ajuster pour ne pas dépasser les limites originales
        if (newMin < currentMin) {
            newMin = currentMin;
            newMax = newMin + newRange;
        }
        if (newMax > currentMax) {
            newMax = currentMax;
            newMin = newMax - newRange;
        }
        
        // Animation de transition
        this.tweens.add({
            targets: this.timeline.container,
            alpha: 0,
            duration: 200,
            onComplete: () => {
                // Mettre à jour la timeline
                this.currentQuestion.timeline.min = newMin;
                this.currentQuestion.timeline.max = newMax;
                this.timeline.destroy();
                this.marker.destroy();
                this.createTimeline();
                
                this.tweens.add({
                    targets: this.timeline.container,
                    alpha: { from: 0, to: 1 },
                    duration: 200
                });
            }
        });
        
        // Feedback visuel
        this.showJokerFeedback('50/50!');
    }
    
    applyFiftyFiftyDecade() {
        // Éliminer la moitié des mauvaises décennies
        if (!this.decadeButtons || this.decadeButtons.length <= 2) return;
        
        const wrongButtons = this.decadeButtons.filter(d => d.decade !== this.correctDecade);
        const toRemove = Math.floor(wrongButtons.length / 2);
        
        // Mélanger et prendre la moitié à enlever
        Phaser.Utils.Array.Shuffle(wrongButtons);
        
        for (let i = 0; i < toRemove; i++) {
            const btn = wrongButtons[i];
            // Griser le bouton (tint gris pour btn_validate image)
            btn.bg.setTint(0x666666);
            btn.btn.setAlpha(0.4);
            // Désactiver le hit area
            btn.hitArea.disableInteractive();
        }
        
        this.showJokerFeedback('50/50!');
    }
    
    applyExtraTime() {
        this.timeRemaining = Math.min(this.timeRemaining + 5, 20);
        this.updateTimerDisplay();
        this.showJokerFeedback('+5s!');
    }
    
    applySkip() {
        // Passer à la question suivante sans pénalité
        if (this.timerEvent) this.timerEvent.remove();
        this.showJokerFeedback('Skip!');
        
        // Nettoyer les éléments du mode décennie
        if (this.gameMode === 'decade') {
            if (this.decadeButtonsContainer) this.decadeButtonsContainer.destroy();
            if (this.decadeHitAreas) this.decadeHitAreas.forEach(h => h.destroy());
        }
        
        this.time.delayedCall(500, () => {
            this.isValidating = false;
            this.startRound();
        });
    }
    
    showJokerFeedback(text) {
        const { width, height } = this.cameras.main;
        
        const feedback = this.add.text(width / 2, height / 2 - 50, `🃏 ${text}`, {
            fontSize: '36px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: feedback,
            y: height / 2 - 100,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => feedback.destroy()
        });
    }

    startGlobalTimer() {
        this.globalTimeRemaining = 60;
        this.globalTimerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.globalTimeRemaining--;
                if (this.globalTimerText) {
                    this.globalTimerText.setText(`${this.globalTimeRemaining}s`);
                    if (this.globalTimeRemaining <= 10) {
                        this.globalTimerText.setColor('#FF6B6B');
                    }
                }
                if (this.globalTimeRemaining <= 0) {
                    this.endGame(false);
                }
            },
            loop: true
        });
    }

    createPauseButton(x, y) {
        const btn = this.add.image(x, y, 'btn_pause');
        btn.setScale(0.25);
        
        // Zone interactive plus grande pour faciliter le clic
        const hitArea = this.add.rectangle(x, y, 100, 50, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        
        hitArea.on('pointerover', () => btn.setScale(0.28));
        hitArea.on('pointerout', () => btn.setScale(0.25));
        hitArea.on('pointerdown', () => this.pauseGame());
    }

    createValidateButton(x, y) {
        const lang = this.lang?.getLanguage() || 'fr';
        const btnTexts = { fr: 'VALIDER', en: 'VALIDATE', de: 'BESTÄTIGEN' };
        const btnText = btnTexts[lang] || btnTexts.fr;
        
        const btn = this.add.container(x, y);
        
        // Image du bouton en bois
        const btnImage = this.add.image(0, 0, 'btn_validate');
        btnImage.setScale(0.55);
        btn.add(btnImage);
        
        // Texte centré sur le bouton - style lisible
        const text = this.add.text(0, -2, btnText, {
            fontSize: '24px', 
            fontFamily: '"Arial Black", sans-serif', 
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        btn.add(text);
        
        this.validateButton = btn;
        
        // Zone interactive - DANS le container avec position relative (0, 0)
        const hitArea = this.add.rectangle(0, 0, 365, 125, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        btn.add(hitArea);
        
        hitArea.on('pointerover', () => btn.setScale(1.08));
        hitArea.on('pointerout', () => btn.setScale(1));
        hitArea.on('pointerdown', () => {
            btn.setScale(0.95);
            if (this.soundManager) this.soundManager.playClickSound();
        });
        hitArea.on('pointerup', () => {
            btn.setScale(1);
            this.validateAnswer();
        });
    }

    getLivesDisplay() {
        let display = '';
        for (let i = 0; i < 3; i++) {
            display += i < this.lives ? '❤️' : '🖤';
        }
        return display;
    }

    startRound() {
        if (this.isValidating) return;
        
        this.questionNumber++;
        
        // Mode classic et decade ont 10 questions
        if ((this.gameMode === 'classic' || this.gameMode === 'decade' || this.gameMode === 'duel') && this.questionNumber > 10) {
            this.endGame(true);
            return;
        }
        
        if (this.gameMode !== 'timeattack' && this.lives <= 0) {
            this.endGame(false);
            return;
        }
        
        // En mode duel, vérifier aussi les vies de l'IA
        if (this.gameMode === 'duel' && this.aiLives <= 0) {
            this.endGame(true); // Joueur gagne
            return;
        }
        
        if (this.questions.length === 0) {
            this.endGame(true);
            return;
        }
        
        const questionIndex = Math.floor(Math.random() * this.questions.length);
        this.currentQuestion = this.questions[questionIndex];
        this.questions.splice(questionIndex, 1);
        
        this.displayQuestion();
        
        // Mode décennie = boutons de décennies, sinon timeline normale
        if (this.gameMode === 'decade') {
            this.createDecadeButtons();
        } else {
            this.createTimeline();
        }
        
        this.startTimer();
    }
    
    createDecadeButtons() {
        // Détruire les anciens boutons
        if (this.decadeButtonsContainer) {
            this.decadeButtonsContainer.destroy();
        }
        if (this.decadeHitAreas) {
            this.decadeHitAreas.forEach(h => h.destroy());
        }
        this.decadeHitAreas = [];
        
        const { width, height } = this.cameras.main;
        const lang = this.lang?.getLanguage() || 'fr';
        const decadeTexts = { fr: 'Choisis la décennie:', en: 'Choose the decade:', de: 'Wähle das Jahrzehnt:' };
        
        // Calculer les décennies à afficher basées sur la timeline
        const min = this.currentQuestion.timeline.min;
        const max = this.currentQuestion.timeline.max;
        const answer = this.currentQuestion.answers[0];
        const correctYear = typeof answer === 'object' ? answer.value : answer;
        this.correctDecade = Math.floor(correctYear / 10) * 10;
        
        // Générer des décennies incluant la bonne réponse
        const startDecade = Math.floor(min / 10) * 10;
        const endDecade = Math.floor(max / 10) * 10;
        
        let decades = [];
        for (let d = startDecade; d <= endDecade; d += 10) {
            decades.push(d);
        }
        
        // Limiter à 6 décennies max, centrées sur la bonne réponse
        if (decades.length > 6) {
            const correctIndex = decades.indexOf(this.correctDecade);
            const start = Math.max(0, correctIndex - 2);
            const end = Math.min(decades.length, start + 6);
            decades = decades.slice(start, end);
        }
        
        this.decadeButtonsContainer = this.add.container(0, 0);
        
        // Instruction - texte en NOIR
        this.decadeButtonsContainer.add(this.add.text(width / 2, 370, decadeTexts[lang] || decadeTexts.fr, {
            fontSize: '22px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            stroke: '#FFFFFF', strokeThickness: 4
        }).setOrigin(0.5));
        
        // Boutons de décennies - 2 lignes avec espacement augmenté
        const btnScale = 0.38;
        const spacingX = 280;  // Plus d'espace horizontal
        const spacingY = 95;   // Plus d'espace vertical
        const cols = Math.ceil(decades.length / 2);
        const row1Count = cols;
        const row2Count = decades.length - cols;
        
        this.decadeButtons = [];
        
        decades.forEach((decade, index) => {
            const row = index < row1Count ? 0 : 1;
            const colIndex = row === 0 ? index : index - row1Count;
            const colsInRow = row === 0 ? row1Count : row2Count;
            
            const rowWidth = colsInRow * spacingX;
            const startX = (width - rowWidth) / 2 + spacingX / 2;
            const x = startX + colIndex * spacingX;
            const y = 430 + row * spacingY;
            
            const btn = this.add.container(x, y);
            
            // Image du bouton en bois (btn_validate)
            const btnImage = this.add.image(0, 0, 'btn_validate');
            btnImage.setScale(btnScale);
            btn.add(btnImage);
            
            const label = this.add.text(0, -2, `${decade}s`, {
                fontSize: '22px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            btn.add(label);
            
            this.decadeButtonsContainer.add(btn);
            
            // HitArea HORS du container pour être cliquable
            const hitArea = this.add.rectangle(x, y, 180, 70, 0xFFFFFF, 0);
            hitArea.setInteractive({ useHandCursor: true });
            this.decadeHitAreas.push(hitArea);
            
            hitArea.on('pointerover', () => btn.setScale(1.1));
            hitArea.on('pointerout', () => btn.setScale(1));
            hitArea.on('pointerdown', () => {
                if (!this.isValidating) {
                    this.selectDecade(decade, btn, btnImage);
                }
            });
            
            this.decadeButtons.push({ decade, btn, bg: btnImage, hitArea });
        });
        
        // Cacher le bouton valider en mode décennie (validation directe au clic)
        if (this.validateButton) {
            this.validateButton.setVisible(false);
        }
    }
    
    selectDecade(decade, btn, bg) {
        if (this.isValidating) return;
        this.isValidating = true;
        
        if (this.timerEvent) this.timerEvent.remove();
        
        // Désactiver tous les boutons
        this.decadeHitAreas.forEach(h => h.disableInteractive());
        
        const isCorrect = decade === this.correctDecade;
        
        // Effet visuel sur le bouton sélectionné (tint pour btn_validate image)
        bg.setTint(isCorrect ? 0x00FF00 : 0xFF0000);
        
        // Montrer la bonne réponse si erreur
        if (!isCorrect) {
            this.decadeButtons.forEach(d => {
                if (d.decade === this.correctDecade) {
                    d.bg.setTint(0x00FF00);
                }
            });
        }
        
        if (isCorrect) {
            this.handleCorrectAnswer(decade, this.correctDecade);
        } else {
            this.handleWrongAnswer(decade, this.correctDecade);
        }
        
        this.showFeedback(isCorrect, this.correctDecade);
    }
    
    displayQuestion() {
        const q = this.currentQuestion;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const catIcons = { musique: '🎵', anime: '⛩️', culture: '🧠', sport: '⚽', cinema: '🎬', jeux: '🕹️', sciences: '🔬', geographie: '🌍', insolite: '🤯' };
        const catNames = {
            musique: { fr: 'MUSIQUE', en: 'MUSIC', de: 'MUSIK' },
            anime: { fr: 'ANIME', en: 'ANIME', de: 'ANIME' },
            culture: { fr: 'CULTURE G', en: 'TRIVIA', de: 'ALLGEMEINWISSEN' },
            sport: { fr: 'SPORT', en: 'SPORTS', de: 'SPORT' },
            cinema: { fr: 'CINÉMA', en: 'MOVIES', de: 'KINO' },
            jeux: { fr: 'JEUX VIDÉO', en: 'VIDEO GAMES', de: 'SPIELE' },
            sciences: { fr: 'SCIENCES', en: 'SCIENCE', de: 'WISSENSCHAFT' },
            geographie: { fr: 'GÉOGRAPHIE', en: 'GEOGRAPHY', de: 'GEOGRAPHIE' },
            insolite: { fr: 'INSOLITE', en: 'UNUSUAL', de: 'KURIOS' }
        };
        
        const cat = q.category ? q.category.toLowerCase() : 'culture';
        const icon = catIcons[cat] || '📁';
        const name = catNames[cat] ? (catNames[cat][lang] || catNames[cat].fr) : (q.category?.toUpperCase() || 'QUESTION');
        
        this.categoryText.setText(`${icon} ${name}`);
        // Utiliser q.question au lieu de q.text
        this.questionText.setText(q.question || q.text || '');
        
        if (this.scoreText) {
            const label = (this.gameMode === 'classic' || this.gameMode === 'decade' || this.gameMode === 'duel') ? `${this.correctAnswers}/10` : `${this.score}`;
            this.scoreText.setText(label);
        }
    }

    createTimeline() {
        if (this.timeline) {
            this.timeline.destroy();
        }
        if (this.marker) {
            this.marker.destroy();
        }
        
        this.timeline = new Timeline(this, this.currentQuestion);
        this.timeline.create();
        
        // Créer le marker avec les bons paramètres
        const min = this.currentQuestion.timeline.min;
        const max = this.currentQuestion.timeline.max;
        
        this.marker = new Marker(this, 0, 0xFF6B6B, this.timeline, min, max);
        
        // Position initiale au CENTRE DE LA ZONE JOUABLE (pas au centre de toute la timeline)
        const startX = this.timeline.getX() + (this.timeline.getWidth() / 2);
        const startY = CONFIG.TIMELINE.Y;
        this.marker.create(startX, startY);
    }

    getSelectedYear() {
        if (this.marker) {
            return this.marker.getValue();
        }
        return null;
    }

    startTimer() {
        // En mode timeattack, pas de timer par question (seulement le timer global de 60s)
        if (this.gameMode === 'timeattack') return;
        
        const times = { easy: 20, normal: 15, hard: 10, expert: 7 };
        this.timeRemaining = times[this.difficulty] || 15;
        
        this.updateTimerDisplay();
        
        if (this.timerEvent) {
            this.timerEvent.remove();
        }
        
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    updateTimer() {
        this.timeRemaining--;
        this.updateTimerDisplay();
        
        if (this.timeRemaining <= 0) {
            this.timerEvent.remove();
            this.handleTimeout();
        }
    }

    updateTimerDisplay() {
        if (this.timerText) {
            this.timerText.setText(`${this.timeRemaining}s`);
            this.timerText.setColor(this.timeRemaining <= 5 ? '#FF6B6B' : '#00D9A5');
        }
    }

    handleTimeout() {
        if (this.isValidating) return;
        this.isValidating = true;
        
        // Jouer le son d'erreur
        if (this.soundManager) this.soundManager.playWrongSound();
        
        this.combo = 0;
        this.updateComboDisplay();
        
        if (this.gameMode !== 'timeattack') {
            this.lives--;
            if (this.livesText) this.livesText.setText(this.getLivesDisplay());
        }
        
        // Obtenir la bonne réponse de la question courante
        let correctAnswer = null;
        if (this.currentQuestion && this.currentQuestion.answers && this.currentQuestion.answers[0]) {
            const answer = this.currentQuestion.answers[0];
            correctAnswer = typeof answer === 'object' ? answer.value : answer;
        }
        
        this.showFeedback(false, correctAnswer);
    }

    validateAnswer() {
        if (this.isValidating || !this.marker) return;
        this.isValidating = true;
        
        if (this.timerEvent) this.timerEvent.remove();
        
        const selectedYear = this.marker.getValue();
        // Extraire la valeur correcte - peut être un objet ou un nombre
        const answer = this.currentQuestion.answers[0];
        const correctAnswer = typeof answer === 'object' ? answer.value : answer;
        const tolerance = this.getTolerance();
        const isCorrect = Math.abs(selectedYear - correctAnswer) <= tolerance;
        
        if (isCorrect) {
            this.handleCorrectAnswer(selectedYear, correctAnswer);
        } else {
            this.handleWrongAnswer(selectedYear, correctAnswer);
        }
        
        this.showFeedback(isCorrect, correctAnswer);
    }

    getTolerance() {
        // Marges ajustées pour timeline de 40 ans
        const tolerances = { easy: 7, normal: 5, hard: 3, expert: 1 };
        return tolerances[this.difficulty] || 5;
    }

    handleCorrectAnswer(selectedYear, correctAnswer) {
        this.correctAnswers++;
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        
        // En mode classique/decade/duel, le score = nombre de bonnes réponses
        // En autres modes, calcul avec multiplicateurs
        if (this.gameMode === 'classic' || this.gameMode === 'decade' || this.gameMode === 'duel') {
            this.score = this.correctAnswers;
        } else {
            const multipliers = { easy: 1, normal: 1.2, hard: 1.5, expert: 2 };
            const basePoints = 10;
            const comboBonus = Math.min(this.combo - 1, 5) * 2;
            const points = Math.round((basePoints + comboBonus) * (multipliers[this.difficulty] || 1));
            this.score += points;
        }
        
        if (this.scoreText) {
            const label = (this.gameMode === 'classic' || this.gameMode === 'decade' || this.gameMode === 'duel') ? `${this.correctAnswers}/10` : `${this.score}`;
            this.scoreText.setText(label);
        }
        
        this.updateComboDisplay();
        if (this.soundManager) this.soundManager.playCorrectSound();
        if (this.particleManager && this.marker && this.marker.container) {
            this.particleManager.burstGold(this.marker.container.x, this.marker.container.y);
        }
        
        // Mode Duel - L'IA joue aussi
        if (this.gameMode === 'duel') {
            this.aiPlay(correctAnswer, true);
        }
    }

    handleWrongAnswer(selectedYear, correctAnswer) {
        this.combo = 0;
        this.updateComboDisplay();
        
        if (this.gameMode !== 'timeattack') {
            this.lives--;
            if (this.livesText) this.livesText.setText(this.getLivesDisplay());
        }
        
        if (this.soundManager) this.soundManager.playWrongSound();
        
        // Mode Duel - L'IA joue aussi
        if (this.gameMode === 'duel') {
            this.aiPlay(correctAnswer, false);
        }
    }
    
    aiPlay(correctAnswer, playerCorrect) {
        // L'IA a une probabilité de réussir basée sur sa difficulté
        const aiCorrect = Math.random() < this.aiDifficulty;
        
        if (aiCorrect) {
            this.aiScore++;
            if (this.aiScoreText) this.aiScoreText.setText(this.aiScore.toString());
        } else {
            this.aiLives--;
            if (this.aiLivesText) {
                const hearts = '❤️'.repeat(Math.max(0, this.aiLives)) + '🖤'.repeat(Math.max(0, 3 - this.aiLives));
                this.aiLivesText.setText(hearts);
            }
        }
        
        // Afficher le résultat de l'IA
        this.showAiResult(aiCorrect);
    }
    
    showAiResult(aiCorrect) {
        const { width } = this.cameras.main;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const texts = {
            fr: { correct: '🤖 IA: Correct!', wrong: '🤖 IA: Faux!' },
            en: { correct: '🤖 AI: Correct!', wrong: '🤖 AI: Wrong!' },
            de: { correct: '🤖 KI: Richtig!', wrong: '🤖 KI: Falsch!' }
        };
        const t = texts[lang] || texts.fr;
        
        const text = aiCorrect ? t.correct : t.wrong;
        
        const aiResult = this.add.text(width / 2, 60, text, {
            fontSize: '16px',
            fontFamily: '"Arial Black", sans-serif',
            color: aiCorrect ? '#00D9A5' : '#FF6B6B',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: aiResult,
            alpha: 0,
            y: 40,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => aiResult.destroy()
        });
    }

    updateComboDisplay() {
        if (!this.comboText) return;
        
        if (this.combo >= 2) {
            this.comboText.setText(`🔥 COMBO x${this.combo}`);
            this.comboText.setVisible(true);
            this.tweens.add({
                targets: this.comboText,
                scale: { from: 1.3, to: 1 },
                duration: 200,
                ease: 'Back.out'
            });
        } else {
            this.comboText.setVisible(false);
        }
    }

    showFeedback(isCorrect, correctAnswer) {
        const { width, height } = this.cameras.main;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const texts = {
            fr: { correct: 'CORRECT !', wrong: 'FAUX !', answer: 'Réponse :', continue: 'CONTINUER' },
            en: { correct: 'CORRECT!', wrong: 'WRONG!', answer: 'Answer:', continue: 'CONTINUE' },
            de: { correct: 'RICHTIG!', wrong: 'FALSCH!', answer: 'Antwort:', continue: 'WEITER' }
        };
        const t = texts[lang] || texts.fr;
        
        // Afficher la zone correcte sur la timeline
        if (this.timeline && correctAnswer !== null) {
            this.timeline.revealCorrectZone(correctAnswer, this.getTolerance());
        }
        
        // Si CORRECT: pas de popup, juste le son et continuer
        if (isCorrect) {
            // Le son est déjà joué dans checkAnswer
            // Auto-continuer après 1 seconde
            this.autoCloseTimer = this.time.delayedCall(1000, () => {
                this.closeFeedbackAndContinue();
            });
            return;
        }
        
        // Si FAUX: utiliser le cadre doré comme dans le menu
        this.feedbackContainer = this.add.container(width / 2, 340);
        
        // Cadre doré (frame_pseudo_new) - étiré horizontalement
        const frame = this.add.image(0, 0, 'frame_pseudo_new');
        frame.setScale(0.55, 0.32);
        this.feedbackContainer.add(frame);
        
        // Texte FAUX + Réponse + Année - tout sur une ligne
        const feedbackText = this.add.text(0, -5, `❌ ${t.wrong}  ${t.answer}  ${correctAnswer !== null ? correctAnswer.toString() : '?'}`, {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);
        this.feedbackContainer.add(feedbackText);
        
        // Animation d'entrée
        this.feedbackContainer.setAlpha(0);
        this.feedbackContainer.y = 310;
        this.tweens.add({
            targets: this.feedbackContainer,
            y: 340,
            alpha: 1,
            duration: 250,
            ease: 'Power2'
        });
        
        // Auto-fermer après 2 secondes
        this.autoCloseTimer = this.time.delayedCall(2000, () => {
            this.closeFeedbackAndContinue();
        });
    }
    
    closeFeedbackAndContinue() {
        // Annuler le timer auto si on clique avant
        if (this.autoCloseTimer) {
            this.autoCloseTimer.remove();
            this.autoCloseTimer = null;
        }
        
        // Si pas de feedbackContainer (bonne réponse), continuer directement
        if (!this.feedbackContainer) {
            this.isValidating = false;
            
            if ((this.gameMode !== 'timeattack' && this.lives <= 0) || 
                (this.gameMode === 'classic' && this.questionNumber >= 10)) {
                this.endGame(this.lives > 0);
            } else {
                this.startRound();
            }
            return;
        }
        
        // Animation de sortie pour la barre de feedback (faux)
        this.tweens.add({
            targets: this.feedbackContainer,
            y: 230,
            alpha: 0,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                if (this.feedbackContainer) {
                    this.feedbackContainer.destroy();
                    this.feedbackContainer = null;
                }
                
                this.isValidating = false;
                
                if ((this.gameMode !== 'timeattack' && this.lives <= 0) || 
                    (this.gameMode === 'classic' && this.questionNumber >= 10)) {
                    this.endGame(this.lives > 0);
                } else {
                    this.startRound();
                }
            }
        });
    }

    pauseGame() {
        if (this.timerEvent) this.timerEvent.paused = true;
        if (this.globalTimerEvent) this.globalTimerEvent.paused = true;
        this.scene.launch('PauseScene', { gameScene: this });
        this.scene.pause();
    }

    resumeGame() {
        if (this.timerEvent) this.timerEvent.paused = false;
        if (this.globalTimerEvent) this.globalTimerEvent.paused = false;
    }

    endGame(isWin) {
        if (this.timerEvent) this.timerEvent.remove();
        if (this.globalTimerEvent) this.globalTimerEvent.remove();
        
        const gameTime = Math.round((Date.now() - this.gameStartTime) / 1000);
        
        // En mode duel, déterminer le gagnant
        let duelResult = null;
        if (this.gameMode === 'duel') {
            if (this.lives <= 0) {
                isWin = false; // Joueur a perdu ses vies
                duelResult = 'ai_wins';
            } else if (this.aiLives <= 0) {
                isWin = true; // IA a perdu ses vies
                duelResult = 'player_wins';
            } else {
                // Fin des 10 questions - comparer les scores
                if (this.correctAnswers > this.aiScore) {
                    isWin = true;
                    duelResult = 'player_wins';
                } else if (this.aiScore > this.correctAnswers) {
                    isWin = false;
                    duelResult = 'ai_wins';
                } else {
                    // Égalité - celui avec le plus de vies gagne
                    isWin = this.lives >= this.aiLives;
                    duelResult = isWin ? 'player_wins' : 'draw';
                }
            }
        }
        
        let progressionResult = null;
        if (this.game.progression) {
            progressionResult = this.game.progression.recordGame({
                score: this.score,
                mode: this.gameMode,
                difficulty: this.difficulty,
                category: this.selectedCategory,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo,
                time: gameTime,
                victory: isWin,
                lives: this.lives,
                isPerfect: this.correctAnswers === 10 && this.lives === 3
            });
        }
        
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('ResultScene', {
                playerName: this.playerName,
                score: this.score,
                maxCombo: this.maxCombo,
                correctAnswers: this.correctAnswers,
                totalQuestions: this.questionNumber,
                victory: isWin,
                lives: this.lives,
                mode: this.gameMode,
                difficulty: this.difficulty,
                category: this.selectedCategory,
                time: gameTime,
                progressionResult: progressionResult,
                // Données duel
                duelResult: duelResult,
                aiScore: this.aiScore,
                aiLives: this.aiLives
            });
        });
    }
}

window.GameScene = GameScene;
