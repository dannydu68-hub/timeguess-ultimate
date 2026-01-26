/**
 * ResultScene.js
 * Écran de résultat avec XP, level up et succès
 */

class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    preload() {
        this.load.image('titre_game_over', 'assets/images/titre_game_over.png?v=110');
        this.load.image('fond_gameover', 'assets/images/fond_gameover.png?v=110');
        this.load.image('cadre_gameover_gauche', 'assets/images/cadre_gameover_gauche.png?v=110');
        this.load.image('cadre_gameover_droite', 'assets/images/cadre_gameover_droite.png?v=110');
        this.load.image('cadre_gameover_boutons', 'assets/images/cadre_gameover_boutons.png?v=110');
        // Assets victoire
        this.load.image('titre_victoire', 'assets/images/titre_victoire.png?v=110');
        this.load.image('fond_victoire', 'assets/images/fond_victoire.png?v=110');
    }

    init(data) {
        this.playerName = data.playerName || 'Joueur';
        this.score = data.score || 0;
        this.maxCombo = data.maxCombo || 0;
        this.victory = data.victory || false;
        this.category = data.category || 'mixte';
        this.difficulty = data.difficulty || 'normal';
        this.lives = data.lives || 0;
        this.gameMode = data.mode || 'classic';
        this.progressionResult = data.progressionResult || null;
        this.correctAnswers = data.correctAnswers || 0;
        this.gameTime = data.time || 0;
        // Données duel
        this.duelResult = data.duelResult || null;
        this.aiScore = data.aiScore || 0;
        this.aiLives = data.aiLives || 0;
    }

    create() {
        const { width, height } = this.cameras.main;
        
        this.progression = this.game.progression;
        this.lang = this.game.lang;
        
        // Envoyer le score au classement mondial
        this.submitToGlobalLeaderboard();

        this.createBackground();
        
        if (this.victory) {
            this.createConfetti();
        }

        this.createContent(width, height);
        
        this.cameras.main.fadeIn(400, 15, 12, 41);
    }

    createBackground() {
        const { width, height } = this.cameras.main;

        // Utiliser l'image de fond appropriée
        if (this.victory) {
            const bgImg = this.add.image(width / 2, height / 2, 'fond_victoire');
            bgImg.setDisplaySize(width, height);
        } else {
            const bgImg = this.add.image(width / 2, height / 2, 'fond_gameover');
            bgImg.setDisplaySize(width, height);
        }
    }

    createConfetti() {
        const { width, height } = this.cameras.main;
        const colors = [0xFFD700, 0x00D9A5, 0xFF6B6B, 0x667EEA, 0x9C27B0];
        
        for (let i = 0; i < 60; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-200, -50);
            const size = Phaser.Math.Between(4, 10);
            const color = Phaser.Utils.Array.GetRandom(colors);
            const confetti = this.add.circle(x, y, size, color);
            
            this.tweens.add({
                targets: confetti,
                y: height + 100,
                x: x + Phaser.Math.Between(-100, 100),
                angle: Phaser.Math.Between(180, 720),
                duration: Phaser.Math.Between(2500, 5000),
                delay: Phaser.Math.Between(0, 2000),
                repeat: -1
            });
        }
    }

    createContent(width, height) {
        let currentY = 40;
        const lang = this.lang?.getLanguage() || 'fr';

        // Icône et titre - Spécial pour mode duel
        let icon, titleText, titleColor;
        
        const duelWinTexts = { fr: 'TU AS GAGNÉ!', en: 'YOU WON!', de: 'DU HAST GEWONNEN!' };
        const duelLoseTexts = { fr: 'L\'IA A GAGNÉ!', en: 'AI WON!', de: 'KI HAT GEWONNEN!' };
        
        // Mode duel : afficher texte
        if (this.gameMode === 'duel') {
            if (this.victory) {
                icon = '🏆';
                titleText = duelWinTexts[lang] || duelWinTexts.fr;
                titleColor = '#FFD700';
            } else {
                icon = '🤖';
                titleText = duelLoseTexts[lang] || duelLoseTexts.fr;
                titleColor = '#FF6B6B';
            }
            
            this.add.text(width / 2, currentY, icon, { fontSize: '50px' }).setOrigin(0.5);
            currentY += 55;
            
            const title = this.add.text(width / 2, currentY, titleText, {
                fontSize: '40px',
                fontFamily: '"Arial Black", sans-serif',
                color: titleColor,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            title.setScale(0);
            this.tweens.add({
                targets: title,
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut'
            });

            currentY += 50;
        }
        // Victoire (hors duel) : afficher image titre victoire - PLUS PETIT
        else if (this.victory) {
            const victoireImg = this.add.image(width / 2, currentY + 30, 'titre_victoire');
            victoireImg.setScale(0.22);
            victoireImg.setScale(0);
            this.tweens.add({
                targets: victoireImg,
                scale: 0.22,
                duration: 500,
                ease: 'Back.easeOut'
            });
            currentY += 80;
        }
        // Game Over (défaite hors duel) : afficher image game over - PLUS PETIT
        else {
            const gameOverImg = this.add.image(width / 2, currentY + 30, 'titre_game_over');
            gameOverImg.setScale(0.28);
            gameOverImg.setScale(0);
            this.tweens.add({
                targets: gameOverImg,
                scale: 0.28,
                duration: 500,
                ease: 'Back.easeOut'
            });
            currentY += 80;
        }

        // Mode de jeu
        const decadeTexts = { fr: 'Décennie', en: 'Decade', de: 'Jahrzehnt' };
        const modeNames = { 
            classic: this.lang.t('mode_classic'), 
            survival: this.lang.t('mode_survival'), 
            timeattack: this.lang.t('mode_timeattack'),
            duel: 'Duel',
            decade: decadeTexts[lang] || decadeTexts.fr
        };
        this.add.text(width / 2, currentY, this.lang.t('result_mode', { mode: modeNames[this.gameMode] || this.gameMode }), {
            fontSize: '16px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#4ECDC4', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        currentY += 30;
        
        // === RÉSULTAT DUEL - déplacé à gauche ===
        if (this.gameMode === 'duel') {
            this.createDuelResult(width / 2 - 200, currentY);
            currentY += 50;
        }

        // === CARTE STATS ===
        this.createStatsCard(width / 2 - 200, currentY, width);
        
        // === CARTE XP (si progression) ===
        if (this.progressionResult) {
            this.createXPCard(width / 2 + 200, currentY);
        }

        currentY += 240;

        // === BOUTONS ET SUCCÈS côte à côte ===
        this.time.delayedCall(1000, () => {
            // Boutons à droite
            this.createButtons(width, height - 60);
            
            // Succès à gauche des boutons
            if (this.progressionResult && this.progressionResult.newAchievements && this.progressionResult.newAchievements.length > 0) {
                this.createAchievementsSection(width / 2 - 200, height - 90);
            }
        });
    }
    
    createDuelResult(x, y) {
        const isGerman = this.lang?.getLanguage() === 'de';
        
        // Panneau comparatif - plus compact et à gauche
        const panelW = 350;
        const panelH = 50;
        
        const bg = this.add.graphics();
        bg.fillStyle(0x9C27B0, 0.3);
        bg.fillRoundedRect(x - panelW/2, y - panelH/2, panelW, panelH, 10);
        bg.lineStyle(2, 0x9C27B0, 0.6);
        bg.strokeRoundedRect(x - panelW/2, y - panelH/2, panelW, panelH, 10);
        
        // Joueur
        this.add.text(x - 140, y, `👤 ${this.playerName}`, {
            fontSize: '14px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0, 0.5);
        
        this.add.text(x - 30, y, `${this.correctAnswers}`, {
            fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: this.victory ? '#00D9A5' : '#FFFFFF'
        }).setOrigin(0.5);
        
        // VS
        this.add.text(x, y, 'VS', {
            fontSize: '14px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);
        
        // IA
        this.add.text(x + 30, y, `${this.aiScore}`, {
            fontSize: '20px', fontFamily: '"Arial Black", sans-serif', color: !this.victory ? '#00D9A5' : '#FFFFFF'
        }).setOrigin(0.5);
        
        this.add.text(x + 140, y, '🤖 IA', {
            fontSize: '14px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0.5);
    }

    createStatsCard(x, y, fullWidth) {
        const cardW = 350;
        const cardH = 220;

        // Toujours utiliser le cadre doré
        const cadre = this.add.image(x, y + cardH/2, 'cadre_gameover_gauche');
        cadre.setDisplaySize(cardW + 30, cardH + 30);

        // Titre avec meilleure visibilité
        this.add.text(x, y + 25, this.lang.t('result_stats'), {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Calculer les pièces gagnées (basé sur le score)
        const coinsEarned = Math.floor(this.score * 2) + (this.victory ? 10 : 5);
        
        // Ajouter les pièces au joueur
        if (this.progression && coinsEarned > 0) {
            this.progression.addCoins(coinsEarned);
        }

        const stats = [
            { label: this.lang.t('result_score'), value: this.score.toString(), color: '#FFD700' },
            { label: this.lang.t('result_combo'), value: `x${this.maxCombo}`, color: '#FF6600' },
            { label: this.lang.t('result_lives'), value: this.lives.toString(), color: this.lives > 0 ? '#00D9A5' : '#FF6B6B' },
            { label: '💰 Coins', value: `+${coinsEarned}`, color: '#FFD700' }
        ];

        stats.forEach((stat, i) => {
            const statY = y + 60 + i * 38;
            this.add.text(x - 130, statY, stat.label, {
                fontSize: '18px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0, 0.5);
            
            this.add.text(x + 130, statY, stat.value, {
                fontSize: '24px',
                fontFamily: '"Arial Black", sans-serif',
                color: stat.color,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(1, 0.5);
        });
    }

    createXPCard(x, y) {
        const cardW = 350;
        const cardH = 220;
        const result = this.progressionResult;

        // Toujours utiliser le cadre doré
        const cadre = this.add.image(x, y + cardH/2, 'cadre_gameover_droite');
        cadre.setDisplaySize(cardW + 30, cardH + 30);

        this.add.text(x, y + 25, '⭐ PROGRESSION', {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // XP gagné
        this.add.text(x, y + 70, `+${result.xpEarned} XP`, {
            fontSize: '32px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Level up ?
        if (result.leveledUp) {
            const levelUpText = this.add.text(x, y + 120, `🎉 NIVEAU ${result.newLevel} !`, {
                fontSize: '26px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#00D9A5', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);

            this.tweens.add({
                targets: levelUpText,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else if (this.progression) {
            const xpProgress = this.progression.getXpProgress();
            
            // Barre XP - calcul corrigé
            const barW = 200;
            const barH = 18;
            const barY = y + 130;
            const fillWidth = Math.max(0, Math.min(barW, (xpProgress.percent / 100) * barW));
            
            // Fond de la barre
            this.add.rectangle(x, barY, barW, barH, 0x333333);
            
            // Remplissage (seulement si > 0)
            if (fillWidth > 0) {
                const fill = this.add.rectangle(x - barW/2, barY, fillWidth, barH, 0xFFD700);
                fill.setOrigin(0, 0.5);
            }
            
            this.add.text(x, barY + 25, `${Math.floor(xpProgress.current)}/${xpProgress.needed} XP`, {
                fontSize: '16px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }
        
        // Afficher le niveau actuel
        const currentLevel = this.progression ? this.progression.level : 1;
        this.add.text(x, y + 190, `Niveau ${currentLevel}`, {
            fontSize: '18px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#4ECDC4', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
    }

    createAchievementsSection(x, y) {
        const achievements = this.progressionResult.newAchievements;

        // Titre
        this.add.text(x, y - 60, '🏆', {
            fontSize: '28px'
        }).setOrigin(0.5);

        // Afficher les succès verticalement
        achievements.forEach((achievement, i) => {
            const achY = y - 20 + i * 50;
            
            const container = this.add.container(x, achY);
            
            const bg = this.add.circle(0, 0, 25, 0x667EEA);
            const icon = this.add.text(0, 0, achievement.icon, { fontSize: '24px' }).setOrigin(0.5);
            
            container.add([bg, icon]);
            
            // Animation
            container.setScale(0);
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 500,
                delay: 500 + i * 200,
                ease: 'Back.easeOut'
            });
        });
    }

    createButtons(width, y) {
        // 2 boutons verticaux centrés
        const btnX = width / 2;
        
        // Bouton Recommencer (en haut)
        this.createGameOverButton(btnX, y - 110, this.lang.t('result_replay'), () => {
            this.scene.start('CategoryScene', { playerName: this.playerName });
        });
        
        // Bouton Menu (en bas)
        this.createGameOverButton(btnX, y - 30, this.lang.t('result_menu'), () => {
            this.scene.start('MenuScene');
        });
    }
    
    createGameOverButton(x, y, text, callback) {
        const btn = this.add.container(x, y);
        
        // Cadre doré pour ce bouton - plus petit
        const cadre = this.add.image(0, 0, 'cadre_gameover_boutons');
        cadre.setScale(0.5);
        
        // Zone cliquable
        const hitArea = this.add.rectangle(0, 0, 200, 35, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });
        
        // Texte centré (sans emoji) - plus petit
        const label = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        btn.add([cadre, hitArea, label]);

        btn.setAlpha(0);
        btn.setY(y + 30);
        this.tweens.add({
            targets: btn,
            alpha: 1,
            y: y,
            duration: 400,
            ease: 'Back.easeOut'
        });

        hitArea.on('pointerover', () => {
            btn.setScale(1.05);
            label.setColor('#FFD700');
        });
        hitArea.on('pointerout', () => {
            btn.setScale(1);
            label.setColor('#FFFFFF');
        });
        hitArea.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });

        return btn;
    }

    createButton(x, y, text, color, callback) {
        const btn = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 220, 50, color);
        bg.setStrokeStyle(2, 0xFFFFFF, 0.6);
        bg.setInteractive({ useHandCursor: true });
        
        const label = this.add.text(0, 0, text, {
            fontSize: '20px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        btn.add([bg, label]);

        btn.setAlpha(0);
        btn.setY(y + 30);
        this.tweens.add({
            targets: btn,
            alpha: 1,
            y: y,
            duration: 400,
            ease: 'Back.easeOut'
        });

        bg.on('pointerover', () => btn.setScale(1.05));
        bg.on('pointerout', () => btn.setScale(1));
        bg.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });

        return btn;
    }
    
    async submitToGlobalLeaderboard() {
        // Ne soumettre que si le score est > 0
        if (this.score <= 0) return;
        
        const firebase = this.game.firebase;
        if (!firebase || !firebase.initialized) {
            console.warn('Firebase non disponible, score non soumis');
            return;
        }
        
        try {
            await firebase.submitScore(this.playerName, {
                score: this.score,
                mode: this.gameMode,
                category: this.category,
                difficulty: this.difficulty,
                correctAnswers: this.correctAnswers,
                maxCombo: this.maxCombo,
                time: this.gameTime,
                victory: this.victory
            });
            console.log('✅ Score soumis au classement mondial !');
        } catch (error) {
            console.error('❌ Erreur soumission score:', error);
        }
    }
}

window.ResultScene = ResultScene;
