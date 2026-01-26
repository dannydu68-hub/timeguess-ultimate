/**
 * AchievementManager.js
 * Gestionnaire d'achievements (badges)
 */

class AchievementManager {
    constructor(scene) {
        this.scene = scene;
        this.achievements = {
            perfectionist: { unlocked: false, name: 'Perfectionniste', desc: '10/10 sans erreur', emoji: '🏆' },
            speedrun: { unlocked: false, name: 'Rapide', desc: 'Finir en moins de 2 minutes', emoji: '⚡' },
            comboMaster: { unlocked: false, name: 'Combo Master', desc: 'Streak de 5', emoji: '🔥' },
            survivor: { unlocked: false, name: 'Survivant', desc: 'Gagner avec 1 vie', emoji: '💪' },
            expert: { unlocked: false, name: 'Expert', desc: '10/10 en mode Expert', emoji: '💀' },
            musicLover: { unlocked: false, name: 'Mélomane', desc: '10/10 en Musique', emoji: '🎵' },
            otaku: { unlocked: false, name: 'Otaku', desc: '10/10 en Animé', emoji: '🎌' },
            scholar: { unlocked: false, name: 'Érudit', desc: '10/10 en Culture', emoji: '📚' },
            curious: { unlocked: false, name: 'Curieux', desc: '10/10 en Insolite', emoji: '🤯' }
        };
        
        this.loadAchievements();
    }

    /**
     * Charge les achievements depuis localStorage
     */
    loadAchievements() {
        try {
            const saved = localStorage.getItem('timeline_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = data[key];
                    }
                });
            }
        } catch (e) {
            console.log('Pas d\'achievements sauvegardés');
        }
    }

    /**
     * Sauvegarde les achievements
     */
    saveAchievements() {
        try {
            const data = {};
            Object.keys(this.achievements).forEach(key => {
                data[key] = this.achievements[key].unlocked;
            });
            localStorage.setItem('timeline_achievements', JSON.stringify(data));
        } catch (e) {
            console.log('Impossible de sauvegarder les achievements');
        }
    }

    /**
     * Débloque un achievement
     */
    unlock(achievementKey) {
        if (this.achievements[achievementKey] && !this.achievements[achievementKey].unlocked) {
            this.achievements[achievementKey].unlocked = true;
            this.saveAchievements();
            this.showUnlockNotification(achievementKey);
            return true;
        }
        return false;
    }

    /**
     * Affiche une notification de déverrouillage
     */
    showUnlockNotification(achievementKey) {
        const achievement = this.achievements[achievementKey];
        const { width } = this.scene.cameras.main;
        
        // Container pour la notification
        const notification = this.scene.add.container(width / 2, -100);
        
        // Fond
        const bg = this.scene.add.rectangle(0, 0, 350, 80, 0x000000, 0.9);
        bg.setStrokeStyle(3, 0xFFD700);
        notification.add(bg);
        
        // Texte
        const title = this.scene.add.text(-150, -20, '🎉 ACHIEVEMENT DÉBLOQUÉ !', {
            fontSize: '14px',
            fontFamily: CONFIG.UI.FONT_FAMILY,
            color: '#FFD700',
            fontStyle: 'bold'
        });
        notification.add(title);
        
        const name = this.scene.add.text(-150, 5, `${achievement.emoji} ${achievement.name}`, {
            fontSize: '18px',
            fontFamily: 'Arial Black, sans-serif',
            color: '#FFFFFF',
            fontStyle: 'bold'
        });
        notification.add(name);
        
        const desc = this.scene.add.text(-150, 28, achievement.desc, {
            fontSize: '12px',
            fontFamily: CONFIG.UI.FONT_FAMILY,
            color: '#AAAAAA'
        });
        notification.add(desc);
        
        // Animation d'entrée
        this.scene.tweens.add({
            targets: notification,
            y: 60,
            duration: 500,
            ease: 'Back.easeOut'
        });
        
        // Animation de sortie
        this.scene.time.delayedCall(3000, () => {
            this.scene.tweens.add({
                targets: notification,
                y: -100,
                duration: 300,
                ease: 'Power2',
                onComplete: () => notification.destroy()
            });
        });
    }

    /**
     * Vérifie les achievements après une partie
     */
    checkAchievements(gameData) {
        // Perfectionniste: 10/10 sans erreur
        if (gameData.score >= 10 && gameData.lives === 3) {
            this.unlock('perfectionist');
        }
        
        // Rapide: moins de 2 minutes
        if (gameData.duration && gameData.duration < 120000) {
            this.unlock('speedrun');
        }
        
        // Combo Master: streak de 5
        if (gameData.maxCombo >= 5) {
            this.unlock('comboMaster');
        }
        
        // Survivant: gagner avec 1 vie
        if (gameData.score >= 10 && gameData.lives === 1) {
            this.unlock('survivor');
        }
        
        // Expert: 10/10 en mode Expert
        if (gameData.score >= 10 && gameData.difficulty === 'expert') {
            this.unlock('expert');
        }
        
        // Catégories spécifiques
        if (gameData.score >= 10) {
            switch (gameData.category) {
                case 'musique':
                    this.unlock('musicLover');
                    break;
                case 'anime':
                    this.unlock('otaku');
                    break;
                case 'culture':
                    this.unlock('scholar');
                    break;
                case 'insolite':
                    this.unlock('curious');
                    break;
            }
        }
    }

    /**
     * Obtient le nombre d'achievements débloqués
     */
    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    /**
     * Obtient le nombre total d'achievements
     */
    getTotalCount() {
        return Object.keys(this.achievements).length;
    }
}

window.AchievementManager = AchievementManager;
