/**
 * StatsManager.js
 * Gestionnaire de statistiques
 */

class StatsManager {
    constructor() {
        this.stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            highestScore: 0,
            highestCombo: 0,
            totalCorrect: 0,
            totalWrong: 0,
            bestTime: null,
            totalTime: 0,
            categoryStats: {
                musique: { played: 0, won: 0, score: 0 },
                anime: { played: 0, won: 0, score: 0 },
                culture: { played: 0, won: 0, score: 0 },
                insolite: { played: 0, won: 0, score: 0 },
                mixte: { played: 0, won: 0, score: 0 }
            },
            difficultyStats: {
                easy: { played: 0, won: 0 },
                normal: { played: 0, won: 0 },
                hard: { played: 0, won: 0 },
                expert: { played: 0, won: 0 }
            }
        };
        
        this.loadStats();
    }

    /**
     * Charge les stats depuis localStorage
     */
    loadStats() {
        try {
            const saved = localStorage.getItem('timeline_stats');
            if (saved) {
                const loadedStats = JSON.parse(saved);
                // Merge avec les stats par défaut pour gérer les nouvelles propriétés
                this.stats = { ...this.stats, ...loadedStats };
                // S'assurer que totalTime existe
                if (typeof this.stats.totalTime !== 'number') {
                    this.stats.totalTime = 0;
                }
            }
        } catch (e) {
            console.log('Pas de stats sauvegardées');
        }
    }

    /**
     * Sauvegarde les stats
     */
    saveStats() {
        try {
            localStorage.setItem('timeline_stats', JSON.stringify(this.stats));
        } catch (e) {
            console.log('Impossible de sauvegarder les stats');
        }
    }

    /**
     * Enregistre une partie terminée
     */
    recordGame(gameData) {
        this.stats.gamesPlayed++;
        this.stats.totalScore += gameData.score;
        
        if (gameData.score > this.stats.highestScore) {
            this.stats.highestScore = gameData.score;
        }
        
        if (gameData.maxCombo > this.stats.highestCombo) {
            this.stats.highestCombo = gameData.maxCombo;
        }
        
        if (gameData.score >= 10) {
            this.stats.gamesWon++;
            
            // Catégorie
            if (this.stats.categoryStats[gameData.category]) {
                this.stats.categoryStats[gameData.category].won++;
            }
            
            // Difficulté
            if (this.stats.difficultyStats[gameData.difficulty]) {
                this.stats.difficultyStats[gameData.difficulty].won++;
            }
        }
        
        // Stats par catégorie
        if (this.stats.categoryStats[gameData.category]) {
            this.stats.categoryStats[gameData.category].played++;
            this.stats.categoryStats[gameData.category].score += gameData.score;
        }
        
        // Stats par difficulté
        if (this.stats.difficultyStats[gameData.difficulty]) {
            this.stats.difficultyStats[gameData.difficulty].played++;
        }
        
        // Temps
        if (gameData.duration) {
            // Ajouter au temps total de jeu (en secondes)
            this.stats.totalTime += gameData.duration;
            
            if (!this.stats.bestTime || gameData.duration < this.stats.bestTime) {
                this.stats.bestTime = gameData.duration;
            }
        }
        
        this.saveStats();
    }

    /**
     * Enregistre une réponse
     */
    recordAnswer(isCorrect) {
        if (isCorrect) {
            this.stats.totalCorrect++;
        } else {
            this.stats.totalWrong++;
        }
        this.saveStats();
    }

    /**
     * Obtient le taux de réussite global
     */
    getWinRate() {
        if (this.stats.gamesPlayed === 0) return 0;
        return Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100);
    }

    /**
     * Obtient le taux de bonnes réponses
     */
    getAccuracy() {
        const total = this.stats.totalCorrect + this.stats.totalWrong;
        if (total === 0) return 0;
        return Math.round((this.stats.totalCorrect / total) * 100);
    }

    /**
     * Obtient la meilleure catégorie
     */
    getBestCategory() {
        let bestCategory = null;
        let bestScore = 0;
        
        Object.keys(this.stats.categoryStats).forEach(category => {
            const stats = this.stats.categoryStats[category];
            if (stats.played > 0) {
                const avgScore = stats.score / stats.played;
                if (avgScore > bestScore) {
                    bestScore = avgScore;
                    bestCategory = category;
                }
            }
        });
        
        return bestCategory;
    }

    /**
     * Réinitialise toutes les stats
     */
    reset() {
        this.stats = {
            gamesPlayed: 0,
            gamesWon: 0,
            totalScore: 0,
            highestScore: 0,
            highestCombo: 0,
            totalCorrect: 0,
            totalWrong: 0,
            bestTime: null,
            categoryStats: {
                musique: { played: 0, won: 0, score: 0 },
                anime: { played: 0, won: 0, score: 0 },
                culture: { played: 0, won: 0, score: 0 },
                insolite: { played: 0, won: 0, score: 0 },
                mixte: { played: 0, won: 0, score: 0 }
            },
            difficultyStats: {
                easy: { played: 0, won: 0 },
                normal: { played: 0, won: 0 },
                hard: { played: 0, won: 0 },
                expert: { played: 0, won: 0 }
            }
        };
        this.saveStats();
    }
}

window.StatsManager = StatsManager;
