/**
 * ProfileScene.js
 * Profil avec onglets: Défis, Stats, Succès
 */

class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ProfileScene' });
        this.currentTab = 'daily';
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
        if (!this.textures.exists('btn_tab_gold_small')) {
            this.load.image('btn_tab_gold_small', 'assets/images/btn_tab_gold.png?v=110');
        }
        if (!this.textures.exists('cadre_grand')) {
            this.load.image('cadre_grand', 'assets/images/frame_content_gold.png?v=130');
        }
        if (!this.textures.exists('btn_daily_chest')) {
            this.load.image('btn_daily_chest', 'assets/images/btn_daily_chest.png?v=129');
        }
        
        // Load avatar images
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`avatar_${i}`)) {
                this.load.image(`avatar_${i}`, `assets/images/avatars/avatar_${i}.png?v=107`);
            }
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.progression = this.game.progression || new ProgressionManager();
        this.lang = this.game.lang;
        
        this.createBackground(width, height);
        this.createHeader(width);
        this.createTabs(width);
        this.contentContainer = this.add.container(0, 0);
        this.showTabContent(width, height);
        this.createBackButton();
        
        this.cameras.main.fadeIn(300);
    }

    createBackground(width, height) {
        const bg = this.add.image(width / 2, height / 2, 'background_night');
        bg.setDisplaySize(width, height);
    }

    createHeader(width) {
        const lang = this.lang?.getLanguage() || 'fr';
        
        // Récupérer le pseudo du joueur depuis localStorage (comme dans MenuScene)
        let playerPseudo = 'Joueur';
        try {
            playerPseudo = localStorage.getItem('timeguess_pseudo') || 'Joueur';
        } catch (e) {
            playerPseudo = 'Joueur';
        }
        
        // Cadre titre doré (même que pseudo)
        const titleFrame = this.add.image(width / 2, 70, 'frame_pseudo_new');
        titleFrame.setScale(0.35);
        
        // Avatar à gauche dans le cadre - même taille que menu principal (0.16)
        const avatarKey = this.progression.currentAvatar || 'avatar_4';
        if (this.textures.exists(avatarKey)) {
            const avatarImg = this.add.image(width / 2 - 120, 70, avatarKey);
            avatarImg.setScale(0.16);
        } else {
            // Fallback si l'image n'existe pas
            this.add.circle(width / 2 - 120, 70, 22, 0xFFD700, 0.3);
            this.add.text(width / 2 - 120, 70, '👤', { fontSize: '32px' }).setOrigin(0.5);
        }
        
        // Niveau à côté de l'avatar
        this.add.text(width / 2 - 70, 70, `Nv.${this.progression.level}`, {
            fontSize: '16px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0, 0.5);
        
        // Pseudo du joueur au centre-droit
        this.add.text(width / 2 + 40, 67, playerPseudo, {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Icône titre joueur à droite
        const titleData = this.progression.getCurrentTitleData();
        this.add.text(width / 2 + 150, 70, `${titleData.icon}`, {
            fontSize: '22px'
        }).setOrigin(0.5);
        
        // Bouton coffre quotidien à droite du cadre titre
        this.createDailyChestButton(width);
    }
    
    createDailyChestButton(width) {
        const canClaim = this.progression?.canClaimDailyChest();
        const y = 70;
        const x = width - 100;
        
        const container = this.add.container(x, y);
        
        // Image du bouton cadeau
        const chestImg = this.add.image(0, 0, 'btn_daily_chest');
        chestImg.setScale(0.22);
        chestImg.setAlpha(canClaim ? 1 : 0.5);
        container.add(chestImg);
        
        // Texte
        const lang = this.lang?.getLanguage() || 'fr';
        const texts = { fr: 'Ouvrir!', en: 'Open!', de: 'Öffnen!' };
        if (canClaim) {
            container.add(this.add.text(0, 55, texts[lang] || texts.fr, {
                fontSize: '10px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5));
            
            // Animation de flottement
            this.tweens.add({
                targets: container,
                y: { from: y - 3, to: y + 3 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 150, 100, 0xFFFFFF, 0);
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
        const toast = this.add.container(width/2, 130);
        
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
            y: 110,
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

    createTabs(width) {
        const lang = this.lang?.getLanguage() || 'fr';
        const tabLabels = {
            fr: { daily: 'Défis', stats: 'Stats', achievements: 'Succès' },
            en: { daily: 'Quests', stats: 'Stats', achievements: 'Achievements' },
            de: { daily: 'Aufgaben', stats: 'Stats', achievements: 'Erfolge' }
        };
        const labels = tabLabels[lang] || tabLabels.fr;
        
        const tabs = [
            { key: 'daily', label: labels.daily, icon: '📅' },
            { key: 'stats', label: labels.stats, icon: '📊' },
            { key: 'achievements', label: labels.achievements, icon: '🏆' }
        ];

        // Onglets à GAUCHE verticalement - taille identique à GlobalLeaderboard
        const tabSpacing = 70;
        const startX = 115;
        const startY = 230;

        tabs.forEach((tab, index) => {
            const x = startX;
            const y = startY + index * tabSpacing;
            const isActive = tab.key === this.currentTab;
            
            // Cadre de l'onglet - même taille que GlobalLeaderboard
            const tabFrame = this.add.image(x, y, 'btn_tab_gold_small');
            tabFrame.setScale(0.28);
            tabFrame.setAlpha(isActive ? 1 : 0.6);
            
            // Texte de l'onglet
            const label = this.add.text(x, y, `${tab.icon} ${tab.label}`, {
                fontSize: '13px', 
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5);
            label.setAlpha(isActive ? 1 : 0.7);
            
            // Zone cliquable
            const hitArea = this.add.rectangle(x, y, 160, 55, 0xFFFFFF, 0);
            hitArea.setInteractive({ useHandCursor: true });
            
            hitArea.on('pointerover', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.9);
                    label.setAlpha(1);
                }
            });
            hitArea.on('pointerout', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.6);
                    label.setAlpha(0.7);
                }
            });
            hitArea.on('pointerdown', () => {
                if (this.game.soundManager) this.game.soundManager.playClickSound();
                if (tab.key !== this.currentTab) {
                    this.currentTab = tab.key;
                    this.scene.restart();
                }
            });
        });
    }

    showTabContent(width, height) {
        switch (this.currentTab) {
            case 'daily': this.createDailyContent(width, height); break;
            case 'stats': this.createStatsContent(width, height); break;
            case 'achievements': this.createAchievementsContent(width, height); break;
        }
    }

    // === DÉFIS QUOTIDIENS ===
    createDailyContent(width, height) {
        const challenges = this.progression.getDailyChallenges();
        const lang = this.lang?.getLanguage() || 'fr';
        
        // Cadre principal - même taille que succès (1.6 x 1.6)
        const frameX = width / 2 + 80;
        const frameY = 380;
        const contentFrame = this.add.image(frameX, frameY, 'cadre_grand');
        contentFrame.setScale(1.6, 1.6);
        this.contentContainer.add(contentFrame);
        
        // Titre DANS le cadre (baissé)
        const titleTexts = { fr: '🎯 DÉFIS DU JOUR', en: '🎯 DAILY CHALLENGES', de: '🎯 TÄGLICHE AUFGABEN' };
        this.contentContainer.add(this.add.text(frameX, 195, titleTexts[lang] || titleTexts.fr, {
            fontSize: '24px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5));

        const challengeTranslations = {
            fr: { 'play_3': 'Jouer 3 parties', 'win_1': 'Gagner 1 partie', 'combo_5': 'Combo de 5', 'perfect': 'Partie parfaite', 'fast_answer': 'Réponse < 3s', 'survival_10': '10 pts en Survie', 'hard_win': 'Gagner en Difficile' },
            en: { 'play_3': 'Play 3 games', 'win_1': 'Win 1 game', 'combo_5': 'Combo of 5', 'perfect': 'Perfect game', 'fast_answer': 'Answer < 3s', 'survival_10': '10 pts Survival', 'hard_win': 'Win on Hard' },
            de: { 'play_3': '3 Spiele spielen', 'win_1': '1 Spiel gewinnen', 'combo_5': '5er Combo', 'perfect': 'Perfektes Spiel', 'fast_answer': 'Antwort < 3s', 'survival_10': '10 Pkt. Überleben', 'hard_win': 'Gewinne auf Schwer' }
        };
        const translations = challengeTranslations[lang] || challengeTranslations.fr;

        challenges.forEach((challenge, index) => {
            const y = 270 + index * 130;
            const isComplete = challenge.completed || challenge.current >= challenge.target;
            
            // Cadre doré - PLUS HAUT (0.30) et plus compact
            const itemFrame = this.add.image(frameX, y, 'frame_pseudo_new');
            itemFrame.setScale(0.65, 0.30);
            if (isComplete) {
                itemFrame.setTint(0x88FF88);
            }
            this.contentContainer.add(itemFrame);
            
            this.contentContainer.add(this.add.text(frameX - 270, y, challenge.icon, { fontSize: '30px' }).setOrigin(0, 0.5));
            
            const translatedDesc = translations[challenge.id] || challenge.desc;
            this.contentContainer.add(this.add.text(frameX - 220, y - 14, translatedDesc, {
                fontSize: '18px', fontFamily: '"Arial Black", sans-serif',
                color: isComplete ? '#00FF66' : '#FFFFFF', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0, 0.5));
            
            const barWidth = 160;
            const progress = Math.min(challenge.current / challenge.target, 1);
            this.contentContainer.add(this.add.rectangle(frameX - 220 + barWidth/2, y + 16, barWidth, 10, 0x333333));
            if (progress > 0) {
                const fill = this.add.rectangle(frameX - 220, y + 16, barWidth * progress, 8, isComplete ? 0x00FF88 : 0x667EEA);
                fill.setOrigin(0, 0.5);
                this.contentContainer.add(fill);
            }
            
            // Compteur rapproché
            this.contentContainer.add(this.add.text(frameX + 150, y, `${challenge.current}/${challenge.target}`, {
                fontSize: '22px', fontFamily: '"Arial Black", sans-serif', color: isComplete ? '#00FF66' : '#FFFFFF', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5));
            
            if (isComplete) {
                this.contentContainer.add(this.add.text(frameX + 230, y, '✓', { fontSize: '26px', color: '#00FF66', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5));
            }
        });

        const rewardTexts = { fr: '🎁 Récompense: 50 pièces par défi', en: '🎁 Reward: 50 coins per challenge', de: '🎁 Belohnung: 50 Münzen pro Aufgabe' };
        this.contentContainer.add(this.add.text(frameX, 575, rewardTexts[lang] || rewardTexts.fr, {
            fontSize: '16px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5));
    }

    // === STATISTIQUES ===
    createStatsContent(width, height) {
        const stats = this.progression.getDetailedStats();
        const lang = this.lang?.getLanguage() || 'fr';
        
        // Cadre principal - même taille que succès (1.6 x 1.6)
        const frameX = width / 2 + 80;
        const frameY = 380;
        const contentFrame = this.add.image(frameX, frameY, 'cadre_grand');
        contentFrame.setScale(1.6, 1.6);
        this.contentContainer.add(contentFrame);
        
        const startY = 200;
        
        const statLabels = {
            fr: ['🎮 Parties jouées', '🏆 Victoires', '📊 Taux victoire', '🎯 Réponses correctes', '⚡ Meilleur combo', '💰 Total pièces', '⏱️ Temps de jeu', '🔥 Meilleure série'],
            en: ['🎮 Games played', '🏆 Victories', '📊 Win rate', '🎯 Correct answers', '⚡ Best combo', '💰 Total coins', '⏱️ Play time', '🔥 Best streak'],
            de: ['🎮 Gespielte Spiele', '🏆 Siege', '📊 Siegrate', '🎯 Richtige Antworten', '⚡ Bestes Combo', '💰 Münzen', '⏱️ Spielzeit', '🔥 Beste Serie']
        };
        const labels = statLabels[lang] || statLabels.fr;
        
        const values = [
            stats.gamesPlayed.toString(), stats.victories.toString(), `${stats.winRate}%`, stats.correctAnswers.toString(),
            stats.bestCombo.toString(), stats.totalCoins.toString(), `${Math.floor(stats.totalTime / 60)}min`, `${stats.bestStreak}j`
        ];

        // Colonnes rapprochées comme succès: ±170
        const cols = 2, spacingY = 95;

        labels.forEach((label, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = frameX + (col === 0 ? -170 : 170);
            const y = startY + row * spacingY;
            
            // Cadre doré - même style que succès (0.28 x 0.24)
            const itemFrame = this.add.image(x, y, 'frame_pseudo_new');
            itemFrame.setScale(0.28, 0.24);
            this.contentContainer.add(itemFrame);
            
            this.contentContainer.add(this.add.text(x - 115, y - 8, label, {
                fontSize: '12px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0, 0.5));
            
            this.contentContainer.add(this.add.text(x + 115, y + 8, values[index], {
                fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 3
            }).setOrigin(1, 0.5));
        });
    }

    // === SUCCÈS ===
    createAchievementsContent(width, height) {
        const allAchievements = this.progression.getAllAchievements();
        // Items plus hauts, colonnes rapprochées
        const cols = 2, spacingY = 90;
        
        // === CADRE PRINCIPAL ===
        const panelX = width / 2 + 80;
        const panelY = 380;
        
        // Cadre image - largeur 1.6, hauteur 1.6 (carrée)
        const contentFrame = this.add.image(panelX, panelY, 'cadre_grand');
        contentFrame.setScale(1.6, 1.6);
        this.contentContainer.add(contentFrame);
        
        // === MASQUE POUR LE SCROLL - ajusté pour rester dans le cadre ===
        const maskShape = this.add.graphics();
        maskShape.fillStyle(0xFFFFFF);
        maskShape.fillRect(panelX - 400, panelY - 220, 800, 420);
        maskShape.setVisible(false);
        
        const mask = maskShape.createGeometryMask();
        
        // Container scrollable pour les succès
        this.achievementsContainer = this.add.container(0, 0);
        this.achievementsContainer.setMask(mask);
        this.contentContainer.add(this.achievementsContainer);
        
        // Position de départ dans le container
        const startY = panelY - 180;

        allAchievements.forEach((achievement, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            // Colonnes rapprochées: ±170
            const x = panelX + (col === 0 ? -170 : 170);
            const y = startY + row * spacingY;
            
            const isUnlocked = this.progression.achievements.includes(achievement.id);
            
            // Cadre doré - PLUS HAUT verticalement (0.30)
            const itemFrame = this.add.image(x, y, 'frame_pseudo_new');
            itemFrame.setScale(0.28, 0.30);
            if (isUnlocked) {
                itemFrame.setTint(0x88FF88);
            } else {
                itemFrame.setTint(0x888888);
            }
            this.achievementsContainer.add(itemFrame);
            
            // Textes - PLUS GRANDS et lisibles
            this.achievementsContainer.add(this.add.text(x - 115, y, achievement.icon, { fontSize: '26px' }).setOrigin(0.5).setAlpha(isUnlocked ? 1 : 0.4));
            this.achievementsContainer.add(this.add.text(x - 85, y - 14, achievement.name, {
                fontSize: '15px', fontFamily: '"Arial Black", sans-serif', color: isUnlocked ? '#FFFFFF' : '#AAAAAA', fontStyle: 'bold', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0.5));
            this.achievementsContainer.add(this.add.text(x - 85, y + 14, achievement.desc, {
                fontSize: '12px', fontFamily: '"Arial Black", sans-serif', color: isUnlocked ? '#CCCCCC' : '#888888', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0, 0.5));
            
            if (isUnlocked) {
                this.achievementsContainer.add(this.add.text(x + 115, y, '✓', { fontSize: '22px', color: '#00FF66', stroke: '#000000', strokeThickness: 4 }).setOrigin(0.5));
            }
        });
        
        // === SCROLL ===
        const totalRows = Math.ceil(allAchievements.length / cols);
        const contentHeight = totalRows * spacingY;
        const visibleHeight = 420;
        
        if (contentHeight > visibleHeight) {
            this.scrollY = 0;
            const maxScroll = contentHeight - visibleHeight + 60;
            
            // Scroll avec la molette
            this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
                this.scrollY += deltaY * 0.5;
                this.scrollY = Phaser.Math.Clamp(this.scrollY, 0, maxScroll);
                this.achievementsContainer.y = -this.scrollY;
            });
            
            // Scroll avec le drag
            let dragStartY = 0;
            let startScrollY = 0;
            
            this.input.on('pointerdown', (pointer) => {
                if (pointer.y > panelY - 230 && pointer.y < panelY + 230) {
                    dragStartY = pointer.y;
                    startScrollY = this.scrollY;
                }
            });
            
            this.input.on('pointermove', (pointer) => {
                if (pointer.isDown && dragStartY !== 0) {
                    const delta = dragStartY - pointer.y;
                    this.scrollY = Phaser.Math.Clamp(startScrollY + delta, 0, maxScroll);
                    this.achievementsContainer.y = -this.scrollY;
                }
            });
            
            this.input.on('pointerup', () => {
                dragStartY = 0;
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
}

window.ProfileScene = ProfileScene;
