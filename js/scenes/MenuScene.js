/**
 * MenuScene.js
 * Menu principal avec pseudo intégré, sans bouton modes
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('logo', 'assets/images/logo.png?v=110');
        this.load.image('background', 'assets/images/background.png?v=110');
        this.load.image('background_night', 'assets/images/background_night.png?v=110');
        this.load.image('btn_profile', 'assets/images/btn_profile.png?v=110');
        this.load.image('btn_profile_new', 'assets/images/btn_profile_new.png?v=110');
        this.load.image('btn_customization', 'assets/images/btn_customization.png?v=110');
        this.load.image('btn_customization_new', 'assets/images/btn_customization_new.png?v=110');
        this.load.image('btn_global', 'assets/images/btn_global.png?v=110');
        this.load.image('btn_global_new', 'assets/images/btn_global_new.png?v=110');
        this.load.image('btn_settings', 'assets/images/btn_settings.png?v=110');
        this.load.image('btn_settings_new', 'assets/images/btn_settings_new.png?v=110');
        this.load.image('btn_play', 'assets/images/btn_play.png?v=110');
        this.load.image('btn_play_new', 'assets/images/btn_play_new.png?v=110');
        this.load.image('btn_daily_chest', 'assets/images/btn_daily_chest.png?v=129');
        this.load.image('frame_level', 'assets/images/frame_level.png?v=110');
        this.load.image('frame_level_new', 'assets/images/frame_level_new.png?v=110');
        this.load.image('frame_challenges', 'assets/images/frame_challenges.png?v=110');
        this.load.image('frame_challenges_new', 'assets/images/frame_challenges_new.png?v=110');
        this.load.image('frame_wood', 'assets/images/frame_wood.png?v=110');
        this.load.image('frame_coins', 'assets/images/frame_coins.png?v=110');
        this.load.image('frame_pseudo', 'assets/images/frame_pseudo.png?v=110');
        this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        this.load.image('btn_wood_oval', 'assets/images/btn_wood_oval.png?v=110');
        
        // Load avatar images
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`avatar_${i}`)) {
                this.load.image(`avatar_${i}`, `assets/images/avatars/avatar_${i}.png?v=110`);
            }
        }
    }

    create() {
        const { width, height } = this.cameras.main;

        if (!this.game.lang) {
            this.game.lang = new LanguageManager();
        }
        this.lang = this.game.lang;

        if (!this.game.progression) {
            this.game.progression = new ProgressionManager();
        }
        this.progression = this.game.progression;

        if (!this.game.soundManager) {
            this.soundManager = new SoundManager(this);
            this.game.soundManager = this.soundManager;
            this.soundManager.playBackgroundMusic();
        }

        this.createBackground(width, height);
        this.createParticles(width, height);
        this.createCoinsDisplay(width);
        // Daily chest moved to ProfileScene
        this.createLevelPanel(width, height); // Panneau niveau en haut à gauche
        this.createHeader(width, height);
        this.createPseudoInput(width, height);
        this.createPlayButton(width, height);
        this.createSecondaryButtons(width, height);
        this.createDailyChallengesWidget(width, height);
        this.createFooter(width, height);

        this.cameras.main.fadeIn(400);
    }

    createBackground(width, height) {
        // Image de fond - original
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
    }

    createParticles(width, height) {
        // Réduire les particules car le fond a déjà des étoiles
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(20, width - 20);
            const y = Phaser.Math.Between(20, height - 20);
            const size = Phaser.Math.FloatBetween(1, 2.5);
            const alpha = Phaser.Math.FloatBetween(0.1, 0.4);
            
            const star = this.add.circle(x, y, size, 0xFFFFFF, alpha);
            
            this.tweens.add({
                targets: star,
                alpha: { from: alpha, to: alpha * 0.2 },
                duration: Phaser.Math.Between(1500, 3500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createCoinsDisplay(width) {
        const coins = this.progression?.getCoins() || 0;
        
        const container = this.add.container(width - 120, 40);
        
        // Image du cadre coins
        const frameBg = this.add.image(0, 0, 'frame_coins');
        frameBg.setScale(0.22);
        container.add(frameBg);
        
        // Nombre de pièces centré
        this.coinsText = this.add.text(18, 0, coins.toString(), {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(this.coinsText);
    }
    
    createDailyChestButton(width) {
        const canClaim = this.progression?.canClaimDailyChest();
        const y = 130;
        
        const container = this.add.container(width - 80, y);
        
        // Image du bouton cadeau (nouvelle image plus grande)
        const chestImg = this.add.image(0, 0, 'btn_daily_chest');
        chestImg.setScale(0.12);
        chestImg.setAlpha(canClaim ? 1 : 0.5);
        container.add(chestImg);
        
        // Texte
        const lang = this.lang?.getLanguage() || 'fr';
        const texts = { fr: 'Ouvrir!', en: 'Open!', de: 'Öffnen!' };
        if (canClaim) {
            container.add(this.add.text(0, 45, texts[lang] || texts.fr, {
                fontSize: '11px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5));
            
            // Animation de flottement vertical fluide (pas de scale)
            this.tweens.add({
                targets: container,
                y: { from: y - 3, to: y + 3 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Interactif - taille basée sur l'image scalée (1536*0.12 x 1024*0.12)
        const hitArea = this.add.rectangle(0, 0, 185, 125, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);
        
        hitArea.on('pointerdown', () => {
            if (canClaim) {
                this.openDailyChest();
            } else {
                this.showChestCooldown();
            }
        });
    }
    
    openDailyChest() {
        const rewards = this.progression.claimDailyChest();
        if (!rewards) return;
        
        const { width, height } = this.cameras.main;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const texts = {
            fr: { title: '🎁 COFFRE QUOTIDIEN!', day: 'Jour', coins: 'Pièces', joker5050: 'Joker 50/50', jokerTime: 'Joker +5s', jokerSkip: 'Joker Passer' },
            en: { title: '🎁 DAILY CHEST!', day: 'Day', coins: 'Coins', joker5050: '50/50 Joker', jokerTime: '+5s Joker', jokerSkip: 'Skip Joker' },
            de: { title: '🎁 TÄGLICHE BELOHNUNG!', day: 'Tag', coins: 'Münzen', joker5050: '50/50 Joker', jokerTime: '+5s Joker', jokerSkip: 'Überspringen Joker' }
        };
        const t = texts[lang] || texts.fr;
        
        // Overlay
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.8);
        overlay.setInteractive();
        
        // Modal
        const modal = this.add.container(width/2, height/2);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x1a1a2e, 0.98);
        bg.fillRoundedRect(-200, -180, 400, 360, 20);
        bg.lineStyle(3, 0xFFD700, 1);
        bg.strokeRoundedRect(-200, -180, 400, 360, 20);
        modal.add(bg);
        
        // Titre
        modal.add(this.add.text(0, -140, t.title, {
            fontSize: '24px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        
        // Streak
        modal.add(this.add.text(0, -100, `🔥 ${t.day} ${rewards.streak}/7`, {
            fontSize: '18px', fontFamily: '"Arial Black", sans-serif', color: '#FF6B6B', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        
        // Récompenses
        let rewardY = -40;
        
        // Pièces
        modal.add(this.add.text(0, rewardY, `🪙 +${rewards.coins} ${t.coins}`, {
            fontSize: '28px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        rewardY += 50;
        
        // XP
        modal.add(this.add.text(0, rewardY, `⭐ +${rewards.xp} XP`, {
            fontSize: '24px', fontFamily: '"Arial Black", sans-serif', color: '#00D9A5', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        rewardY += 50;
        
        // Joker bonus
        if (rewards.joker) {
            const jokerNames = {
                fiftyFifty: t.joker5050,
                extraTime: t.jokerTime,
                skip: t.jokerSkip
            };
            modal.add(this.add.text(0, rewardY, `🃏 +1 ${jokerNames[rewards.joker]}`, {
                fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: '#9C27B0', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5));
            rewardY += 50;
        }
        
        // Bouton fermer
        const closeBtn = this.add.container(0, 130);
        const closeBg = this.add.graphics();
        closeBg.fillStyle(0x00D9A5, 1);
        closeBg.fillRoundedRect(-80, -22, 160, 44, 22);
        closeBtn.add(closeBg);
        closeBtn.add(this.add.text(0, 0, 'OK', {
            fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        modal.add(closeBtn);
        
        const closeHit = this.add.rectangle(0, 130, 160, 44, 0xFFFFFF, 0);
        closeHit.setInteractive({ useHandCursor: true });
        modal.add(closeHit);
        
        closeHit.on('pointerdown', () => {
            overlay.destroy();
            modal.destroy();
            this.scene.restart();
        });
        
        // Animation
        modal.setScale(0);
        this.tweens.add({
            targets: modal,
            scale: 1,
            duration: 400,
            ease: 'Back.out'
        });
        
        if (this.game.soundManager) this.game.soundManager.playCorrectSound();
    }
    
    showChestCooldown() {
        const timeLeft = this.progression.getTimeUntilNextChest();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        
        const lang = this.lang?.getLanguage() || 'fr';
        const messages = {
            fr: `Prochain coffre dans ${hours}h ${minutes}m`,
            en: `Next chest in ${hours}h ${minutes}m`,
            de: `Nächster Chest in ${hours}h ${minutes}m`
        };
        const message = messages[lang] || messages.fr;
        
        // Afficher un petit toast
        const { width } = this.cameras.main;
        const toast = this.add.container(width/2, 150);
        
        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.8);
        bg.fillRoundedRect(-150, -20, 300, 40, 20);
        toast.add(bg);
        
        toast.add(this.add.text(0, 0, message, {
            fontSize: '14px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5));
        
        toast.setAlpha(0);
        this.tweens.add({
            targets: toast,
            alpha: 1,
            y: 130,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: toast,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => toast.destroy()
                    });
                });
            }
        });
    }

    createLevelPanel(width, height) {
        const level = this.progression.level;
        const xpProgress = this.progression.getXpProgress();
        
        // Container en haut à gauche
        const levelContainer = this.add.container(130, 50);
        
        // Cadre niveau/avatar (860x290 pixels, scale 0.28 = 241x81 affichés)
        const frameBg = this.add.image(0, 0, 'frame_level_new');
        frameBg.setScale(0.28);
        levelContainer.add(frameBg);
        
        // Calculs basés sur l'image originale:
        // - Petit carré doré: centre à environ (55, 60) dans image 860x290
        // - Centre image = (430, 145)
        // - Position relative avatar = (55-430, 60-145) * 0.28 = (-105, -24)
        // - Zone bleue: de x=115 à x=835, centre = 475, relatif = (475-430)*0.28 = 13
        
        // Avatar - centré dans le carré doré
        const avatarKey = this.progression.currentAvatar || 'avatar_4';
        if (this.textures.exists(avatarKey)) {
            const avatarImg = this.add.image(-70, -5, avatarKey);
            avatarImg.setScale(0.13);
            levelContainer.add(avatarImg);
        } else {
            levelContainer.add(this.add.text(-70, -5, '👤', {
                fontSize: '28px'
            }).setOrigin(0.5));
        }
        
        // Texte niveau - centré dans la zone bleue
        const contentCenterX = 13;
        levelContainer.add(this.add.text(contentCenterX, -10, `Lv.${level}`, {
            fontSize: '14px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5));
        
        // Barre XP - centrée dans la zone bleue
        const barWidth = 100;
        const barX = contentCenterX - barWidth/2;
        const barY = 10;
        
        // Fond de la barre
        levelContainer.add(this.add.rectangle(contentCenterX, barY, barWidth, 8, 0x1a3a4a, 0.8).setOrigin(0.5));
        
        // Remplissage
        const fillW = Math.min((xpProgress.percent / 100) * barWidth, barWidth);
        if (fillW > 0) {
            const fill = this.add.rectangle(barX, barY, fillW, 6, 0xFFD700);
            fill.setOrigin(0, 0.5);
            levelContainer.add(fill);
        }
        
        // Pourcentage XP - à droite de la barre
        levelContainer.add(this.add.text(contentCenterX + barWidth/2 + 8, barY, `${Math.floor(xpProgress.percent)}%`, {
            fontSize: '9px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5));
    }

    createHeader(width, height) {
        const titleY = height * 0.22;
        
        // Logo image
        const logo = this.add.image(width / 2, titleY, 'logo');
        logo.setScale(0.45);
        
        // Animation de flottement vertical très fluide (pas de scale)
        this.tweens.add({
            targets: logo,
            y: { from: titleY - 2, to: titleY + 2 },
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createPseudoInput(width, height) {
        const inputY = height * 0.42;

        // Image du nouveau cadre pseudo doré - agrandi
        const framePseudo = this.add.image(width / 2, inputY, 'frame_pseudo_new');
        framePseudo.setScale(0.38);

        // Charger le pseudo sauvegardé
        let savedPseudo = '';
        try {
            savedPseudo = localStorage.getItem('timeguess_pseudo') || '';
        } catch (e) {}

        // Input HTML - centré dans le cadre doré
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.id = 'pseudoInput';
        inputElement.placeholder = this.lang.t('menu_pseudo_placeholder');
        inputElement.value = savedPseudo;
        inputElement.maxLength = 15;
        
        // Calculer la position exacte dans le cadre
        const canvas = this.game.canvas;
        const canvasRect = canvas.getBoundingClientRect();
        const scaleX = canvasRect.width / CONFIG.GAME.WIDTH;
        const scaleY = canvasRect.height / CONFIG.GAME.HEIGHT;
        
        // Position centrée dans le cadre doré
        const zoneNoireCenterX = width / 2;
        const inputWidth = 290;
        const inputHeight = 50;
        const inputLeft = canvasRect.left + (zoneNoireCenterX - inputWidth/2) * scaleX;
        const inputTop = canvasRect.top + (inputY - inputHeight/2) * scaleY;
        
        inputElement.style.cssText = `
            position: fixed;
            left: ${inputLeft}px;
            top: ${inputTop}px;
            width: ${inputWidth * scaleX}px;
            height: ${inputHeight * scaleY}px;
            background: transparent;
            border: none;
            outline: none;
            color: #5D4E37;
            font-size: ${32 * scaleY}px;
            font-family: "Arial Black", sans-serif;
            text-align: center;
            letter-spacing: 2px;
            z-index: 1000;
            text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
            line-height: ${inputHeight * scaleY}px;
            padding: 0;
            margin: 0;
        `;

        document.body.appendChild(inputElement);
        this.pseudoInput = inputElement;

        inputElement.addEventListener('input', () => {
            try {
                localStorage.setItem('timeguess_pseudo', inputElement.value);
            } catch (e) {}
        });

        // Mettre à jour la position si la fenêtre change
        this.updateInputPosition = () => {
            if (!this.pseudoInput) return;
            const rect = this.game.canvas.getBoundingClientRect();
            const sX = rect.width / CONFIG.GAME.WIDTH;
            const sY = rect.height / CONFIG.GAME.HEIGHT;
            const centerX = width / 2;
            const inW = 290;
            const inH = 50;
            this.pseudoInput.style.left = `${rect.left + (centerX - inW/2) * sX}px`;
            this.pseudoInput.style.top = `${rect.top + (inputY - inH/2) * sY}px`;
            this.pseudoInput.style.width = `${inW * sX}px`;
            this.pseudoInput.style.height = `${inH * sY}px`;
            this.pseudoInput.style.fontSize = `${32 * sY}px`;
            this.pseudoInput.style.lineHeight = `${inH * sY}px`;
        };
        
        window.addEventListener('resize', this.updateInputPosition);

        this.events.on('shutdown', () => {
            window.removeEventListener('resize', this.updateInputPosition);
            if (this.pseudoInput && this.pseudoInput.parentNode) {
                this.pseudoInput.parentNode.removeChild(this.pseudoInput);
            }
        });
    }

    createPlayButton(width, height) {
        const y = height * 0.60;
        
        const container = this.add.container(width / 2, y);

        // Nouveau bouton play doré - agrandi
        const btnImage = this.add.image(0, 0, 'btn_play_new');
        btnImage.setScale(0.28);
        container.add(btnImage);

        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 240, 80, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => container.setScale(1.05));
        hitArea.on('pointerout', () => container.setScale(1));
        hitArea.on('pointerdown', () => {
            container.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
        });
        hitArea.on('pointerup', () => {
            container.setScale(1.05);
            this.startGame();
        });
    }
    
    createTutorialButton(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        const tutorialTexts = {
            fr: 'TUTORIEL',
            en: 'TUTORIAL',
            de: 'ANLEITUNG'
        };
        
        // Vérifier si c'est un nouveau joueur
        let isNewPlayer = false;
        try {
            isNewPlayer = !localStorage.getItem('timeguess_tutorial_seen');
        } catch (e) {}
        
        // Position à gauche de l'écran
        const x = 80;
        const y = 350;
        
        const container = this.add.container(x, y);
        
        // Image du bouton bois ovale
        const btnImg = this.add.image(0, 0, 'btn_wood_oval');
        btnImg.setScale(0.12);
        container.add(btnImg);
        
        // Icône livre
        const icon = this.add.text(-25, -1, '📖', {
            fontSize: '12px'
        }).setOrigin(0.5);
        container.add(icon);
        
        // Texte avec stroke
        const label = this.add.text(10, -1, tutorialTexts[lang] || tutorialTexts.fr, {
            fontSize: '10px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        container.add(label);
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 180, 120, 0xFFFFFF, 0);
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
        
        // Animation pour les nouveaux joueurs
        if (isNewPlayer) {
            this.tweens.add({
                targets: container,
                scale: { from: 1, to: 1.15 },
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    goToTutorial() {
        const pseudo = this.pseudoInput ? this.pseudoInput.value.trim() : '';
        const playerName = pseudo || (this.lang.getLanguage() === 'de' ? 'Spieler' : 'Joueur');
        
        if (this.pseudoInput && this.pseudoInput.parentNode) {
            this.pseudoInput.parentNode.removeChild(this.pseudoInput);
        }
        
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('TutorialScene', { playerName });
        });
    }

    createSecondaryButtons(width, height) {
        const y = height * 0.84;
        const lang = this.lang?.getLanguage() || 'fr';
        
        const buttonLabels = {
            fr: { profile: 'PROFIL', custom: 'PERSONNALISATION', ranking: 'CLASSEMENT' },
            en: { profile: 'PROFILE', custom: 'CUSTOMIZATION', ranking: 'RANKING' },
            de: { profile: 'PROFIL', custom: 'ANPASSUNG', ranking: 'RANGLISTE' }
        };
        const labels = buttonLabels[lang] || buttonLabels.fr;
        
        const spacing = 200;
        const startX = width / 2 - spacing;

        // Bouton Profil avec avatar et label
        this.createProfileButton(startX, y, labels.profile);
        
        // Bouton Personnalisation avec label - check for new unlocks
        const hasNewUnlocks = this.progression?.hasNewUnlockedItems() || false;
        this.createLabeledButton(startX + spacing, y, 'btn_customization_new', labels.custom, () => this.goToScene('LeaderboardScene'), hasNewUnlocks);
        
        // Bouton Classement avec label
        this.createLabeledButton(startX + spacing * 2, y, 'btn_global_new', labels.ranking, () => this.goToScene('GlobalLeaderboardScene'), false);
        
        // Bouton paramètres dans le coin en bas à droite
        this.createSettingsButton(width - 50, height - 50);
    }
    
    createLabeledButton(x, y, imageKey, label, callback, showNotification = false) {
        const container = this.add.container(x, y);
        
        // Image du bouton
        const btnImage = this.add.image(0, 0, imageKey);
        btnImage.setScale(0.22);
        container.add(btnImage);
        
        // Label DANS le bouton (sur la partie bois)
        const labelText = this.add.text(0, 25, label, {
            fontSize: '9px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(labelText);
        
        // Point rouge de notification si nécessaire
        if (showNotification) {
            const notifDot = this.add.circle(35, -30, 10, 0xFF0000);
            notifDot.setStrokeStyle(2, 0xFFFFFF);
            container.add(notifDot);
            
            // Animation pulse
            this.tweens.add({
                targets: notifDot,
                scale: { from: 1, to: 1.2 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        // Zone de clic
        const hitArea = this.add.rectangle(0, 0, 130, 100, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.1);
            labelText.setColor('#FFD700');
        });
        hitArea.on('pointerout', () => {
            container.setScale(1);
            labelText.setColor('#FFFFFF');
        });
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });
    }
    
    createProfileButton(x, y, label) {
        const container = this.add.container(x, y);
        
        // Image du bouton profil
        const btnImage = this.add.image(0, 0, 'btn_profile_new');
        btnImage.setScale(0.22);
        container.add(btnImage);
        
        // Avatar du joueur dans le cercle - très agrandi pour couvrir tout le cercle
        const avatarKey = this.progression.currentAvatar || 'avatar_4';
        if (this.textures.exists(avatarKey)) {
            const avatarImg = this.add.image(0, -17, avatarKey);
            avatarImg.setScale(0.18);
            container.add(avatarImg);
        }
        
        // Label DANS le bouton (sur la partie bois)
        const labelText = this.add.text(0, 25, label, {
            fontSize: '9px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add(labelText);
        
        // Point rouge de notification si coffre quotidien disponible
        const canClaimChest = this.progression?.canClaimDailyChest();
        if (canClaimChest) {
            const notifDot = this.add.circle(35, -30, 10, 0xFF0000);
            notifDot.setStrokeStyle(2, 0xFFFFFF);
            container.add(notifDot);
            
            // Animation pulse
            this.tweens.add({
                targets: notifDot,
                scale: { from: 1, to: 1.2 },
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        // Zone de clic
        const hitArea = this.add.rectangle(0, 0, 120, 100, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.1);
            labelText.setColor('#FFD700');
        });
        hitArea.on('pointerout', () => {
            container.setScale(1);
            labelText.setColor('#FFFFFF');
        });
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.goToScene('ProfileScene');
        });
    }
    
    createSettingsButton(x, y) {
        const container = this.add.container(x, y);
        
        // Nouveau bouton engrenage - agrandi
        const btnImage = this.add.image(0, 0, 'btn_settings_new');
        btnImage.setScale(0.22);
        container.add(btnImage);

        // Zone de clic
        const hitArea = this.add.rectangle(0, 0, 70, 70, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => container.setScale(1.1));
        hitArea.on('pointerout', () => container.setScale(1));
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.goToScene('SettingsScene');
        });
    }

    createImageButton(x, y, imageKey, callback, scale = 0.22) {
        const container = this.add.container(x, y);
        
        // Image du bouton - nouveau design bois
        const btnImage = this.add.image(0, 0, imageKey);
        btnImage.setScale(scale);
        container.add(btnImage);

        // Zone de clic - agrandie
        const hitArea = this.add.rectangle(0, 0, 130, 100, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.1);
        });
        hitArea.on('pointerout', () => {
            container.setScale(1);
        });
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });
    }

    // Ancienne méthode conservée pour compatibilité
    createIconButton(x, y, emoji, tooltip, callback) {
        const container = this.add.container(x, y);
        const size = 60;

        const shadow = this.add.circle(3, 3, size/2, 0x000000, 0.3);
        container.add(shadow);

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.6);
        bg.fillCircle(0, 0, size/2);
        bg.lineStyle(2, 0x667EEA, 0.6);
        bg.strokeCircle(0, 0, size/2);
        container.add(bg);

        container.add(this.add.text(0, 0, emoji, { fontSize: '26px' }).setOrigin(0.5));

        const tooltipText = this.add.text(0, size/2 + 15, tooltip, {
            fontSize: '11px', fontFamily: '"Arial Black", sans-serif', color: '#CCCCCC', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
        container.add(tooltipText);

        // Zone de clic - DANS le container avec position relative (0, 0)
        const hitArea = this.add.circle(0, 0, size/2, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        container.add(hitArea);

        hitArea.on('pointerover', () => {
            container.setScale(1.12);
            tooltipText.setColor('#FFFFFF');
        });
        hitArea.on('pointerout', () => {
            container.setScale(1);
            tooltipText.setColor('#888888');
        });
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });
    }

    createDailyChallengesWidget(width, height) {
        const challenges = this.progression.getDailyChallenges();
        const lang = this.lang.getLanguage();
        
        // Traductions des défis
        const challengeTranslations = {
            fr: {
                'play_3': 'Joue 3 parties', 'win_1': 'Gagne 1 partie', 'combo_3': 'Fais un combo x3',
                'correct_10': '10 bonnes réponses', 'perfect_1': 'Fais un sans-faute',
                'play_music': 'Joue en Musique', 'play_anime': 'Joue en Anime', 'play_culture': 'Joue en Culture',
                'play_sport': 'Joue en Sport', 'play_cinema': 'Joue en Cinéma', 'score_15': 'Atteins 15 points',
                'fast_answer': 'Réponds en <3s', 'survival_10': '10 pts en Survie', 'hard_win': 'Gagne en Difficile'
            },
            en: {
                'play_3': 'Play 3 games', 'win_1': 'Win 1 game', 'combo_3': 'Get x3 combo',
                'correct_10': '10 correct answers', 'perfect_1': 'Perfect game',
                'play_music': 'Play Music', 'play_anime': 'Play Anime', 'play_culture': 'Play Culture',
                'play_sport': 'Play Sports', 'play_cinema': 'Play Cinema', 'score_15': 'Reach 15 points',
                'fast_answer': 'Answer in <3s', 'survival_10': '10 pts Survival', 'hard_win': 'Win on Hard'
            },
            de: {
                'play_3': 'Spiele 3 Partien', 'win_1': 'Gewinne 1 Partie', 'combo_3': 'Erreiche x3 Combo',
                'correct_10': '10 richtige Antworten', 'perfect_1': 'Perfekte Partie',
                'play_music': 'Spiele Musik', 'play_anime': 'Spiele Anime', 'play_culture': 'Spiele Kultur',
                'play_sport': 'Spiele Sport', 'play_cinema': 'Spiele Kino', 'score_15': 'Erreiche 15 Punkte',
                'fast_answer': 'Antwort unter 3s', 'survival_10': '10 Pkt. Überleben', 'hard_win': 'Gewinne auf Schwer'
            }
        };
        const translations = challengeTranslations[lang] || challengeTranslations.fr;
        const titleTexts = { fr: 'DÉFIS QUOTIDIENS', en: 'DAILY QUESTS', de: 'TÄGLICHE AUFGABEN' };
        
        // Position - décalé vers la gauche pour remplir l'espace
        const widgetX = width - 180;
        const widgetY = height / 2 + 40;
        
        const widget = this.add.container(widgetX, widgetY);
        
        // Nouveau cadre défis
        const frameBg = this.add.image(0, 0, 'frame_challenges_new');
        frameBg.setScale(0.55);
        widget.add(frameBg);
        
        // Titre dans la bannière - plus grand et lisible
        widget.add(this.add.text(0, -115, titleTexts[lang] || titleTexts.fr, {
            fontSize: '13px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5));
        
        challenges.forEach((challenge, index) => {
            const y = -50 + index * 40;
            const isComplete = challenge.completed || challenge.current >= challenge.target;
            
            widget.add(this.add.text(-90, y, challenge.icon, { fontSize: '18px' }).setOrigin(0, 0.5));
            
            const translatedDesc = translations[challenge.id] || challenge.desc;
            const descText = translatedDesc.length > 18 ? translatedDesc.substring(0, 16) + '...' : translatedDesc;
            widget.add(this.add.text(-65, y, descText, {
                fontSize: '14px',
                fontFamily: '"Arial Black", sans-serif',
                color: isComplete ? '#00FF66' : '#FFFFFF',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0, 0.5));
            
            if (isComplete) {
                widget.add(this.add.text(85, y, '✓', { fontSize: '18px', color: '#00FF66', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5));
            } else {
                widget.add(this.add.text(85, y, `${challenge.current}/${challenge.target}`, {
                    fontSize: '14px',
                    fontFamily: '"Arial Black", sans-serif',
                    color: '#FFD700', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5));
            }
        });
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 220, 220, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        widget.add(hitArea);
        
        hitArea.on('pointerover', () => widget.setScale(1.03));
        hitArea.on('pointerout', () => widget.setScale(1));
        hitArea.on('pointerdown', () => this.goToScene('ProfileScene'));
    }

    createFooter(width, height) {
        this.add.text(width / 2, height - 12, 'v2.0 Ultimate Edition', {
            fontSize: '10px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
        }).setOrigin(0.5);
    }

    startGame() {
        const pseudo = this.pseudoInput ? this.pseudoInput.value.trim() : '';
        const playerName = pseudo || (this.lang.getLanguage() === 'de' ? 'Spieler' : 'Joueur');

        if (this.pseudoInput && this.pseudoInput.parentNode) {
            this.pseudoInput.parentNode.removeChild(this.pseudoInput);
        }

        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('CategoryScene', { playerName });
        });
    }

    goToScene(sceneKey) {
        if (this.pseudoInput && this.pseudoInput.parentNode) {
            this.pseudoInput.parentNode.removeChild(this.pseudoInput);
        }
        this.cameras.main.fadeOut(250);
        this.time.delayedCall(250, () => this.scene.start(sceneKey));
    }
}

window.MenuScene = MenuScene;
