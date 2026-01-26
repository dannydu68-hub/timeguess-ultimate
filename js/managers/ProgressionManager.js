/**
 * ProgressionManager.js
 * Gère les niveaux, XP, succès, défis quotidiens, titres et statistiques
 */

class ProgressionManager {
    constructor() {
        this.loadData();
        this.checkDailyReset();
    }

    loadData() {
        const saved = localStorage.getItem('timeguess_progression');
        if (saved) {
            const data = JSON.parse(saved);
            this.xp = data.xp || 0;
            this.level = data.level || 1;
            this.totalGames = data.totalGames || 0;
            this.totalCorrect = data.totalCorrect || 0;
            this.totalPerfect = data.totalPerfect || 0;
            this.bestScore = data.bestScore || 0;
            this.bestCombo = data.bestCombo || 0;
            this.achievements = data.achievements || [];
            this.unlockedCursors = data.unlockedCursors || ['default'];
            this.unlockedAvatars = data.unlockedAvatars || ['avatar_4'];
            this.currentCursor = data.currentCursor || 'default';
            this.currentAvatar = data.currentAvatar || 'avatar_4';
            this.leaderboard = data.leaderboard || [];
            
            // Nouveaux systèmes
            this.titles = data.titles || ['Débutant'];
            this.currentTitle = data.currentTitle || 'Débutant';
            this.dailyChallenges = data.dailyChallenges || this.generateDailyChallenges();
            this.lastDailyReset = data.lastDailyReset || new Date().toDateString();
            this.categoryStats = data.categoryStats || {
                musique: { played: 0, correct: 0, wins: 0 },
                anime: { played: 0, correct: 0, wins: 0 },
                culture: { played: 0, correct: 0, wins: 0 },
                sport: { played: 0, correct: 0, wins: 0 },
                cinema: { played: 0, correct: 0, wins: 0 },
                jeux: { played: 0, correct: 0, wins: 0 },
                sciences: { played: 0, correct: 0, wins: 0 },
                geographie: { played: 0, correct: 0, wins: 0 },
                mixte: { played: 0, correct: 0, wins: 0 },
                insolite: { played: 0, correct: 0, wins: 0 }
            };
            this.streakDays = data.streakDays || 0;
            this.lastPlayDate = data.lastPlayDate || null;
            this.totalPlayTime = data.totalPlayTime || 0;
            this.fastestAnswer = data.fastestAnswer || 999;
            this.perfectGames = data.perfectGames || 0;
            this.weeklyXp = data.weeklyXp || [];
            
            // === NOUVEAUTÉS ===
            // Pièces
            this.coins = data.coins || 0;
            this.totalCoinsEarned = data.totalCoinsEarned || 0;
            
            // Jokers
            this.jokers = data.jokers || { fiftyFifty: 3, extraTime: 3, skip: 3 };
            
            // Coffres quotidiens
            this.lastChestClaim = data.lastChestClaim || null;
            this.chestStreak = data.chestStreak || 0;
            
            // Stats supplémentaires
            this.jokersUsed = data.jokersUsed || 0;
            this.duelsWon = data.duelsWon || 0;
            this.duelsPlayed = data.duelsPlayed || 0;
            this.decadeGamesWon = data.decadeGamesWon || 0;
            
            // Tracking des items vus (pour les notifications)
            this.seenAvatars = data.seenAvatars || ['avatar_4'];
            this.seenCursors = data.seenCursors || ['default'];
            
            // S'assurer que toutes les récompenses sont débloquées selon le niveau
            this.checkLevelRewards();
            this.saveData();
            
        } else {
            this.resetToDefaults();
        }
    }

    resetToDefaults() {
        this.xp = 0;
        this.level = 1;
        this.totalGames = 0;
        this.totalCorrect = 0;
        this.totalPerfect = 0;
        this.bestScore = 0;
        this.bestCombo = 0;
        this.achievements = [];
        this.unlockedCursors = ['default'];
        this.unlockedAvatars = ['avatar_4'];
        this.currentCursor = 'default';
        this.currentAvatar = 'avatar_4';
        this.leaderboard = [];
        this.titles = ['Débutant'];
        this.currentTitle = 'Débutant';
        this.dailyChallenges = this.generateDailyChallenges();
        this.lastDailyReset = new Date().toDateString();
        this.categoryStats = {
            musique: { played: 0, correct: 0, wins: 0 },
            anime: { played: 0, correct: 0, wins: 0 },
            culture: { played: 0, correct: 0, wins: 0 },
            sport: { played: 0, correct: 0, wins: 0 },
            cinema: { played: 0, correct: 0, wins: 0 },
            jeux: { played: 0, correct: 0, wins: 0 },
            sciences: { played: 0, correct: 0, wins: 0 },
            geographie: { played: 0, correct: 0, wins: 0 },
            mixte: { played: 0, correct: 0, wins: 0 },
            insolite: { played: 0, correct: 0, wins: 0 }
        };
        this.streakDays = 0;
        this.lastPlayDate = null;
        this.totalPlayTime = 0;
        this.fastestAnswer = 999;
        this.perfectGames = 0;
        this.weeklyXp = [];
        
        // === NOUVEAUTÉS ===
        this.coins = 100; // Bonus de départ
        this.totalCoinsEarned = 100;
        this.jokers = { fiftyFifty: 3, extraTime: 3, skip: 3 };
        this.lastChestClaim = null;
        this.chestStreak = 0;
        this.jokersUsed = 0;
        this.duelsWon = 0;
        this.duelsPlayed = 0;
        this.decadeGamesWon = 0;
        
        // Tracking des items vus
        this.seenAvatars = ['avatar_4'];
        this.seenCursors = ['default'];
    }
    saveData() {
        const data = {
            xp: this.xp,
            level: this.level,
            totalGames: this.totalGames,
            totalCorrect: this.totalCorrect,
            totalPerfect: this.totalPerfect,
            bestScore: this.bestScore,
            bestCombo: this.bestCombo,
            achievements: this.achievements,
            unlockedCursors: this.unlockedCursors,
            unlockedAvatars: this.unlockedAvatars,
            currentCursor: this.currentCursor,
            currentAvatar: this.currentAvatar,
            leaderboard: this.leaderboard,
            titles: this.titles,
            currentTitle: this.currentTitle,
            dailyChallenges: this.dailyChallenges,
            lastDailyReset: this.lastDailyReset,
            categoryStats: this.categoryStats,
            streakDays: this.streakDays,
            lastPlayDate: this.lastPlayDate,
            totalPlayTime: this.totalPlayTime,
            fastestAnswer: this.fastestAnswer,
            perfectGames: this.perfectGames,
            weeklyXp: this.weeklyXp,
            // === NOUVEAUTÉS ===
            coins: this.coins,
            totalCoinsEarned: this.totalCoinsEarned,
            jokers: this.jokers,
            lastChestClaim: this.lastChestClaim,
            chestStreak: this.chestStreak,
            jokersUsed: this.jokersUsed,
            duelsWon: this.duelsWon,
            duelsPlayed: this.duelsPlayed,
            decadeGamesWon: this.decadeGamesWon,
            seenAvatars: this.seenAvatars,
            seenCursors: this.seenCursors
        };
        localStorage.setItem('timeguess_progression', JSON.stringify(data));
    }

    // === DÉFIS QUOTIDIENS ===
    
    generateDailyChallenges() {
        const allChallenges = [
            { id: 'play_3', desc: 'Joue 3 parties', icon: '🎮', target: 3, current: 0, xp: 50 },
            { id: 'win_1', desc: 'Gagne 1 partie', icon: '🏆', target: 1, current: 0, xp: 30 },
            { id: 'combo_3', desc: 'Fais un combo x3', icon: '🔥', target: 3, current: 0, xp: 40 },
            { id: 'correct_10', desc: 'Réponds correctement 10 fois', icon: '✅', target: 10, current: 0, xp: 35 },
            { id: 'perfect_1', desc: 'Fais un sans-faute', icon: '💯', target: 1, current: 0, xp: 100 },
            { id: 'play_music', desc: 'Joue en catégorie Musique', icon: '🎵', target: 1, current: 0, xp: 25 },
            { id: 'play_anime', desc: 'Joue en catégorie Anime', icon: '⛩️', target: 1, current: 0, xp: 25 },
            { id: 'play_culture', desc: 'Joue en catégorie Culture', icon: '🧠', target: 1, current: 0, xp: 25 },
            { id: 'play_sport', desc: 'Joue en catégorie Sport', icon: '⚽', target: 1, current: 0, xp: 25 },
            { id: 'play_cinema', desc: 'Joue en catégorie Cinéma', icon: '🎬', target: 1, current: 0, xp: 25 },
            { id: 'score_15', desc: 'Atteins 15 points en une partie', icon: '⭐', target: 15, current: 0, xp: 60 },
            { id: 'fast_answer', desc: 'Réponds en moins de 3 secondes', icon: '⚡', target: 1, current: 0, xp: 45 },
            { id: 'survival_10', desc: 'Atteins 10 points en Survie', icon: '💪', target: 10, current: 0, xp: 70 },
            { id: 'hard_win', desc: 'Gagne en difficulté Difficile', icon: '😰', target: 1, current: 0, xp: 80 }
        ];
        
        // Sélectionner 3 défis aléatoires
        const shuffled = allChallenges.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    checkDailyReset() {
        const today = new Date().toDateString();
        if (this.lastDailyReset !== today) {
            this.dailyChallenges = this.generateDailyChallenges();
            this.lastDailyReset = today;
            this.saveData();
        }
    }

    updateDailyChallenge(challengeId, value = 1) {
        const challenge = this.dailyChallenges.find(c => c.id === challengeId);
        if (challenge && challenge.current < challenge.target) {
            challenge.current = Math.min(challenge.target, challenge.current + value);
            
            // Vérifier si complété
            if (challenge.current >= challenge.target && !challenge.completed) {
                challenge.completed = true;
                this.addXp(challenge.xp);
                this.saveData();
                return challenge;
            }
            this.saveData();
        }
        return null;
    }

    getDailyChallenges() {
        this.checkDailyReset();
        return this.dailyChallenges;
    }

    // === TITRES ===
    
    getAllTitles() {
        return [
            { id: 'Débutant', desc: 'Titre de départ', icon: '🌱', condition: () => true },
            { id: 'Joueur', desc: 'Joue 5 parties', icon: '🎮', condition: () => this.totalGames >= 5 },
            { id: 'Amateur', desc: 'Atteins le niveau 3', icon: '📊', condition: () => this.level >= 3 },
            { id: 'Passionné', desc: 'Joue 25 parties', icon: '❤️', condition: () => this.totalGames >= 25 },
            { id: 'Expert', desc: 'Atteins le niveau 10', icon: '🎯', condition: () => this.level >= 10 },
            { id: 'Maître', desc: 'Atteins le niveau 20', icon: '👑', condition: () => this.level >= 20 },
            { id: 'Légende', desc: 'Atteins le niveau 30', icon: '🌟', condition: () => this.level >= 30 },
            { id: 'Mélomane', desc: 'Gagne 10 parties en Musique', icon: '🎵', condition: () => this.categoryStats.musique.wins >= 10 },
            { id: 'Otaku', desc: 'Gagne 10 parties en Anime', icon: '⛩️', condition: () => this.categoryStats.anime.wins >= 10 },
            { id: 'Érudit', desc: 'Gagne 10 parties en Culture', icon: '🧠', condition: () => this.categoryStats.culture.wins >= 10 },
            { id: 'Sportif', desc: 'Gagne 10 parties en Sport', icon: '⚽', condition: () => this.categoryStats.sport?.wins >= 10 },
            { id: 'Cinéphile', desc: 'Gagne 10 parties en Cinéma', icon: '🎬', condition: () => this.categoryStats.cinema?.wins >= 10 },
            { id: 'Gamer', desc: 'Gagne 10 parties en Jeux Vidéo', icon: '🕹️', condition: () => this.categoryStats.jeux?.wins >= 10 },
            { id: 'Scientifique', desc: 'Gagne 10 parties en Sciences', icon: '🔬', condition: () => this.categoryStats.sciences?.wins >= 10 },
            { id: 'Explorateur', desc: 'Gagne 10 parties en Géographie', icon: '🌍', condition: () => this.categoryStats.geographie?.wins >= 10 },
            { id: 'Perfectionniste', desc: 'Fais 5 parties parfaites', icon: '💯', condition: () => this.perfectGames >= 5 },
            { id: 'Speedrunner', desc: 'Réponds en moins de 1 seconde', icon: '⚡', condition: () => this.fastestAnswer < 1 },
            { id: 'Survivant', desc: 'Atteins 50 points en Survie', icon: '🛡️', condition: () => this.bestScore >= 50 },
            { id: 'Combo King', desc: 'Atteins un combo x15', icon: '🔥', condition: () => this.bestCombo >= 15 },
            { id: 'Assidu', desc: 'Joue 7 jours de suite', icon: '📅', condition: () => this.streakDays >= 7 },
            { id: 'Vétéran', desc: 'Joue 100 parties', icon: '🎖️', condition: () => this.totalGames >= 100 },
            { id: 'Immortel', desc: 'Joue 500 parties', icon: '♾️', condition: () => this.totalGames >= 500 }
        ];
    }

    checkNewTitles() {
        const newTitles = [];
        this.getAllTitles().forEach(title => {
            if (!this.titles.includes(title.id) && title.condition()) {
                this.titles.push(title.id);
                newTitles.push(title);
            }
        });
        if (newTitles.length > 0) {
            this.saveData();
        }
        return newTitles;
    }

    setTitle(titleId) {
        if (this.titles.includes(titleId)) {
            this.currentTitle = titleId;
            this.saveData();
            return true;
        }
        return false;
    }

    getCurrentTitleData() {
        return this.getAllTitles().find(t => t.id === this.currentTitle) || this.getAllTitles()[0];
    }

    // === STATISTIQUES DÉTAILLÉES ===
    
    getCategoryStats() {
        return this.categoryStats;
    }

    getBestCategory() {
        let best = null;
        let bestWins = 0;
        Object.entries(this.categoryStats).forEach(([cat, stats]) => {
            if (stats.wins > bestWins) {
                bestWins = stats.wins;
                best = cat;
            }
        });
        return best;
    }

    getWorstCategory() {
        let worst = null;
        let worstRatio = 1;
        Object.entries(this.categoryStats).forEach(([cat, stats]) => {
            if (stats.played > 5) {
                const ratio = stats.correct / stats.played;
                if (ratio < worstRatio) {
                    worstRatio = ratio;
                    worst = cat;
                }
            }
        });
        return worst;
    }

    getAccuracyByCategory() {
        const accuracy = {};
        Object.entries(this.categoryStats).forEach(([cat, stats]) => {
            if (stats.played > 0) {
                accuracy[cat] = Math.round((stats.correct / stats.played) * 100);
            } else {
                accuracy[cat] = 0;
            }
        });
        return accuracy;
    }

    getWeeklyXpData() {
        const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const today = new Date();
        const result = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();
            const dayXp = this.weeklyXp.find(w => w.date === dateStr);
            result.push({
                day: days[date.getDay()],
                xp: dayXp ? dayXp.xp : 0
            });
        }
        return result;
    }

    addWeeklyXp(amount) {
        const today = new Date().toDateString();
        const existing = this.weeklyXp.find(w => w.date === today);
        if (existing) {
            existing.xp += amount;
        } else {
            this.weeklyXp.push({ date: today, xp: amount });
        }
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        this.weeklyXp = this.weeklyXp.filter(w => new Date(w.date) >= cutoff);
    }

    // === XP ET NIVEAUX ===
    
    getXpForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    getXpProgress() {
        const currentLevelXp = this.getXpForLevel(this.level);
        const nextLevelXp = this.getXpForLevel(this.level + 1);
        const xpInLevel = this.xp - currentLevelXp;
        const xpNeeded = nextLevelXp - currentLevelXp;
        return {
            current: Math.max(0, xpInLevel),
            needed: xpNeeded,
            percent: Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100))
        };
    }

    addXp(amount) {
        this.xp += amount;
        this.addWeeklyXp(amount);
        
        let leveledUp = false;
        while (this.xp >= this.getXpForLevel(this.level + 1)) {
            this.level++;
            leveledUp = true;
            this.checkLevelRewards();
        }
        
        this.saveData();
        return leveledUp;
    }

    checkLevelRewards() {
        // Curseurs débloqués par niveau
        const cursorRewards = {
            3: 'cursor_1', 5: 'cursor_2', 8: 'cursor_3', 10: 'cursor_4', 15: 'cursor_5',
            20: 'cursor_6', 25: 'cursor_7', 30: 'cursor_8', 35: 'cursor_9', 40: 'cursor_10',
            50: 'cursor_11'
        };
        
        const avatarRewards = {
            5: 'avatar_9', 10: 'avatar_6', 15: 'avatar_7', 20: 'avatar_1', 25: 'avatar_11',
            30: 'avatar_8', 35: 'avatar_10', 40: 'avatar_5', 45: 'avatar_2', 50: 'avatar_3'
        };

        // Débloquer TOUS les curseurs jusqu'au niveau actuel
        Object.entries(cursorRewards).forEach(([lvl, cursorId]) => {
            if (parseInt(lvl) <= this.level && !this.unlockedCursors.includes(cursorId)) {
                this.unlockedCursors.push(cursorId);
            }
        });
        
        // Débloquer TOUS les avatars jusqu'au niveau actuel
        Object.entries(avatarRewards).forEach(([lvl, avatar]) => {
            if (parseInt(lvl) <= this.level && !this.unlockedAvatars.includes(avatar)) {
                this.unlockedAvatars.push(avatar);
            }
        });
    }

    // === SUCCÈS ===
    
    getAllAchievements() {
        return [
            // Victoires de base
            { id: 'first_win', name: 'Première Victoire', desc: 'Gagne ta première partie', icon: '🏆', xp: 50 },
            { id: 'perfect_10', name: 'Sans Faute', desc: 'Fais 10/10 sans erreur', icon: '💯', xp: 200 },
            { id: 'wins_10', name: 'Champion', desc: 'Gagne 10 parties', icon: '🥇', xp: 100 },
            { id: 'wins_50', name: 'Invincible', desc: 'Gagne 50 parties', icon: '🏅', xp: 250 },
            { id: 'wins_100', name: 'Imbattable', desc: 'Gagne 100 parties', icon: '👑', xp: 500 },
            
            // Combos
            { id: 'combo_3', name: 'Combo Débutant', desc: 'Atteins un combo x3', icon: '🔥', xp: 30 },
            { id: 'combo_5', name: 'Combo Master', desc: 'Atteins un combo x5', icon: '🔥', xp: 75 },
            { id: 'combo_10', name: 'Combo Légendaire', desc: 'Atteins un combo x10', icon: '💥', xp: 200 },
            { id: 'combo_15', name: 'Combo Divin', desc: 'Atteins un combo x15', icon: '⚡', xp: 400 },
            
            // Vitesse
            { id: 'speed_demon', name: 'Speed Demon', desc: 'Réponds en moins de 2s', icon: '⚡', xp: 50 },
            { id: 'speed_master', name: 'Éclair', desc: 'Réponds en moins de 1s', icon: '💨', xp: 150 },
            
            // Modes spéciaux
            { id: 'survivor', name: 'Survivant', desc: '20 pts en Survie', icon: '💪', xp: 100 },
            { id: 'survivor_50', name: 'Immortel', desc: '50 pts en Survie', icon: '🛡️', xp: 300 },
            { id: 'survivor_100', name: 'Invulnérable', desc: '100 pts en Survie', icon: '♾️', xp: 600 },
            { id: 'time_attack_30', name: 'Contre la Montre', desc: '30 pts en Chrono', icon: '⏱️', xp: 150 },
            { id: 'time_attack_50', name: 'Maître du Temps', desc: '50 pts en Chrono', icon: '⏰', xp: 350 },
            
            // Parties jouées
            { id: 'games_10', name: 'Habitué', desc: 'Joue 10 parties', icon: '🎮', xp: 50 },
            { id: 'games_50', name: 'Vétéran', desc: 'Joue 50 parties', icon: '🎖️', xp: 150 },
            { id: 'games_100', name: 'Légende', desc: 'Joue 100 parties', icon: '👑', xp: 300 },
            { id: 'games_500', name: 'Titan', desc: 'Joue 500 parties', icon: '🗿', xp: 750 },
            
            // Catégories
            { id: 'music_master', name: 'Mélomane', desc: '5 victoires Musique', icon: '🎵', xp: 75 },
            { id: 'anime_master', name: 'Otaku', desc: '5 victoires Anime', icon: '⛩️', xp: 75 },
            { id: 'culture_master', name: 'Érudit', desc: '5 victoires Culture', icon: '🧠', xp: 75 },
            { id: 'sport_master', name: 'Sportif', desc: '5 victoires Sport', icon: '⚽', xp: 75 },
            { id: 'cinema_master', name: 'Cinéphile', desc: '5 victoires Cinéma', icon: '🎬', xp: 75 },
            
            // Difficulté
            { id: 'expert_win', name: 'Expert', desc: 'Gagne en mode Expert', icon: '💀', xp: 200 },
            { id: 'expert_10', name: 'Maître Expert', desc: '10 victoires en Expert', icon: '☠️', xp: 500 },
            { id: 'hard_perfect', name: 'Perfection Difficile', desc: 'Sans-faute en Difficile', icon: '🔥', xp: 300 },
            
            // Niveaux
            { id: 'level_5', name: 'Apprenti', desc: 'Atteins le niveau 5', icon: '📈', xp: 0 },
            { id: 'level_10', name: 'Confirmé', desc: 'Atteins le niveau 10', icon: '📈', xp: 0 },
            { id: 'level_20', name: 'Maître', desc: 'Atteins le niveau 20', icon: '⭐', xp: 0 },
            { id: 'level_30', name: 'Grand Maître', desc: 'Atteins le niveau 30', icon: '🌟', xp: 0 },
            { id: 'level_50', name: 'Légende Vivante', desc: 'Atteins le niveau 50', icon: '👑', xp: 0 },
            
            // Streak
            { id: 'streak_7', name: 'Assidu', desc: '7 jours de suite', icon: '📅', xp: 100 },
            { id: 'streak_30', name: 'Dévoué', desc: '30 jours de suite', icon: '🗓️', xp: 400 },
            
            // Divers
            { id: 'all_categories', name: 'Polyvalent', desc: 'Gagne dans 5 catégories', icon: '🌈', xp: 150 },
            { id: 'all_modes', name: 'Touche-à-tout', desc: 'Gagne dans tous les modes', icon: '🎯', xp: 200 },
            
            // === NOUVEAUX SUCCÈS ===
            // Pièces
            { id: 'coins_500', name: 'Économe', desc: 'Accumule 500 pièces', icon: '🪙', xp: 50 },
            { id: 'coins_2000', name: 'Riche', desc: 'Accumule 2000 pièces', icon: '💰', xp: 150 },
            { id: 'coins_10000', name: 'Millionnaire', desc: 'Gagne 10000 pièces au total', icon: '🤑', xp: 400 },
            
            // Jokers
            { id: 'joker_first', name: 'Coup de Pouce', desc: 'Utilise ton premier joker', icon: '🃏', xp: 20 },
            { id: 'joker_master', name: 'Jokeur', desc: 'Utilise 50 jokers', icon: '🎭', xp: 100 },
            { id: 'no_joker_win', name: 'Puriste', desc: 'Gagne sans utiliser de joker', icon: '🎯', xp: 75 },
            
            // Coffres
            { id: 'chest_7', name: 'Collectionneur', desc: 'Ouvre 7 coffres de suite', icon: '📦', xp: 100 },
            
            // Duel
            { id: 'duel_first', name: 'Duelliste', desc: 'Gagne ton premier duel', icon: '⚔️', xp: 75 },
            { id: 'duel_10', name: 'Gladiateur', desc: 'Gagne 10 duels', icon: '🏛️', xp: 200 },
            { id: 'duel_50', name: 'Champion de l\'Arène', desc: 'Gagne 50 duels', icon: '🦁', xp: 500 },
            
            // Mode Décennie
            { id: 'decade_first', name: 'Nostalgique', desc: 'Gagne en mode Décennie', icon: '📅', xp: 50 },
            { id: 'decade_10', name: 'Historien', desc: '10 victoires en Décennie', icon: '📚', xp: 150 },
            
            // Parfaits
            { id: 'perfect_3', name: 'Triple Parfait', desc: '3 parties parfaites', icon: '✨', xp: 150 },
            { id: 'perfect_10_total', name: 'Perfectionniste', desc: '10 parties parfaites', icon: '💎', xp: 400 }
        ];
    }

    unlockAchievement(achievementId) {
        if (this.achievements.includes(achievementId)) return null;
        
        const achievement = this.getAllAchievements().find(a => a.id === achievementId);
        if (achievement) {
            this.achievements.push(achievementId);
            if (achievement.xp > 0) this.addXp(achievement.xp);
            this.saveData();
            return achievement;
        }
        return null;
    }

    checkAchievements(gameData) {
        const unlocked = [];
        
        if (gameData.victory && !this.achievements.includes('first_win')) {
            const a = this.unlockAchievement('first_win');
            if (a) unlocked.push(a);
        }
        
        if (gameData.victory && gameData.lives === 3 && !this.achievements.includes('perfect_10')) {
            const a = this.unlockAchievement('perfect_10');
            if (a) unlocked.push(a);
        }
        
        if (gameData.maxCombo >= 3) this.unlockAchievement('combo_3');
        if (gameData.maxCombo >= 5) this.unlockAchievement('combo_5');
        if (gameData.maxCombo >= 10) this.unlockAchievement('combo_10');
        
        if (gameData.victory && gameData.difficulty === 'expert') this.unlockAchievement('expert_win');
        
        if (gameData.mode === 'survival' && gameData.score >= 20) this.unlockAchievement('survivor');
        if (gameData.mode === 'survival' && gameData.score >= 50) this.unlockAchievement('survivor_50');
        
        if (gameData.mode === 'timeattack' && gameData.score >= 30) this.unlockAchievement('time_attack_30');
        
        if (this.totalGames >= 10) this.unlockAchievement('games_10');
        if (this.totalGames >= 50) this.unlockAchievement('games_50');
        if (this.totalGames >= 100) this.unlockAchievement('games_100');
        
        if (this.level >= 5) this.unlockAchievement('level_5');
        if (this.level >= 10) this.unlockAchievement('level_10');
        if (this.level >= 20) this.unlockAchievement('level_20');
        
        if (this.categoryStats.musique?.wins >= 5) this.unlockAchievement('music_master');
        if (this.categoryStats.anime?.wins >= 5) this.unlockAchievement('anime_master');
        if (this.categoryStats.culture?.wins >= 5) this.unlockAchievement('culture_master');
        if (this.categoryStats.sport?.wins >= 5) this.unlockAchievement('sport_master');
        if (this.categoryStats.cinema?.wins >= 5) this.unlockAchievement('cinema_master');
        
        if (this.streakDays >= 7) this.unlockAchievement('streak_7');
        
        let categoriesWon = 0;
        Object.values(this.categoryStats).forEach(stat => {
            if (stat.wins >= 1) categoriesWon++;
        });
        if (categoriesWon >= 5) this.unlockAchievement('all_categories');
        
        return unlocked;
    }

    // === LEADERBOARD ===
    
    addToLeaderboard(name, score, mode, difficulty) {
        const entry = {
            name, score, mode, difficulty,
            date: new Date().toISOString(),
            avatar: this.currentAvatar,
            title: this.currentTitle
        };
        
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.score - a.score);
        this.leaderboard = this.leaderboard.slice(0, 20);
        this.saveData();
        return this.leaderboard.findIndex(e => e === entry) + 1;
    }

    getLeaderboard(mode = null) {
        if (mode) return this.leaderboard.filter(e => e.mode === mode);
        return this.leaderboard;
    }

    // === CURSEURS ===
    
    getCursors() {
        return {
            default: { name: 'Classique', image: 'cursor', price: 0, level: 1 },
            cursor_1: { name: 'Flèche Bleue', image: 'cursor_1', price: 0, level: 3 },
            cursor_2: { name: 'Ailes Dorées', image: 'cursor_2', price: 0, level: 5 },
            cursor_3: { name: 'Cristal Violet', image: 'cursor_3', price: 0, level: 8 },
            cursor_4: { name: 'Cœur', image: 'cursor_4', price: 0, level: 10 },
            cursor_5: { name: 'Crâne', image: 'cursor_5', price: 0, level: 15 },
            cursor_6: { name: 'Arc-en-ciel', image: 'cursor_6', price: 0, level: 20 },
            cursor_7: { name: 'Champignon', image: 'cursor_7', price: 0, level: 25 },
            cursor_8: { name: 'Glace', image: 'cursor_8', price: 0, level: 30 },
            cursor_9: { name: 'Cadeau', image: 'cursor_9', price: 0, level: 35 },
            cursor_10: { name: 'Lune Étoilée', image: 'cursor_10', price: 0, level: 40 },
            cursor_11: { name: 'Main Dorée', image: 'cursor_11', price: 0, level: 50 }
        };
    }

    setCursor(cursorId) {
        if (this.unlockedCursors.includes(cursorId)) {
            this.currentCursor = cursorId;
            // Marquer comme vu
            if (!this.seenCursors.includes(cursorId)) {
                this.seenCursors.push(cursorId);
            }
            this.saveData();
            return true;
        }
        return false;
    }

    getCurrentCursor() {
        return this.getCursors()[this.currentCursor] || this.getCursors()['default'];
    }

    getCurrentCursorImage() {
        const cursor = this.getCurrentCursor();
        return cursor.image;
    }

    setAvatar(avatar) {
        if (this.unlockedAvatars.includes(avatar)) {
            this.currentAvatar = avatar;
            // Marquer comme vu
            if (!this.seenAvatars.includes(avatar)) {
                this.seenAvatars.push(avatar);
            }
            this.saveData();
            return true;
        }
        return false;
    }
    
    // Vérifie s'il y a des items débloqués mais pas encore vus
    hasNewUnlockedItems() {
        // Vérifier les avatars
        for (const avatar of this.unlockedAvatars) {
            if (!this.seenAvatars || !this.seenAvatars.includes(avatar)) {
                return true;
            }
        }
        // Vérifier les curseurs
        for (const cursor of this.unlockedCursors) {
            if (!this.seenCursors || !this.seenCursors.includes(cursor)) {
                return true;
            }
        }
        return false;
    }
    
    // Marquer tous les items comme vus
    markAllItemsAsSeen() {
        this.seenAvatars = [...this.unlockedAvatars];
        this.seenCursors = [...this.unlockedCursors];
        this.saveData();
    }

    // === STATS DE PARTIE ===
    
    recordGame(gameData) {
        this.totalGames++;
        this.totalCorrect += gameData.correctAnswers || 0;
        
        // Ajouter le temps de jeu
        if (gameData.time) {
            this.totalPlayTime += gameData.time;
        }
        
        const cat = gameData.category || 'mixte';
        if (!this.categoryStats[cat]) {
            this.categoryStats[cat] = { played: 0, correct: 0, wins: 0 };
        }
        this.categoryStats[cat].played++;
        this.categoryStats[cat].correct += gameData.correctAnswers || 0;
        if (gameData.victory) this.categoryStats[cat].wins++;
        
        if (gameData.victory && gameData.lives === 3) this.perfectGames++;
        
        if (gameData.score > this.bestScore) this.bestScore = gameData.score;
        if (gameData.maxCombo > this.bestCombo) this.bestCombo = gameData.maxCombo;
        if (gameData.fastestAnswer && gameData.fastestAnswer < this.fastestAnswer) {
            this.fastestAnswer = gameData.fastestAnswer;
        }
        
        // Streak
        const today = new Date().toDateString();
        if (this.lastPlayDate) {
            const lastDate = new Date(this.lastPlayDate);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) this.streakDays++;
            else if (diffDays > 1) this.streakDays = 1;
        } else {
            this.streakDays = 1;
        }
        this.lastPlayDate = today;
        
        // Défis quotidiens
        this.updateDailyChallenge('play_3', 1);
        this.updateDailyChallenge('correct_10', gameData.correctAnswers || 0);
        if (gameData.victory) this.updateDailyChallenge('win_1', 1);
        if (gameData.maxCombo >= 3) this.updateDailyChallenge('combo_3', gameData.maxCombo);
        if (gameData.victory && gameData.lives === 3) this.updateDailyChallenge('perfect_1', 1);
        if (gameData.score >= 15) this.updateDailyChallenge('score_15', gameData.score);
        if (gameData.fastestAnswer && gameData.fastestAnswer < 3) this.updateDailyChallenge('fast_answer', 1);
        if (gameData.mode === 'survival' && gameData.score >= 10) this.updateDailyChallenge('survival_10', gameData.score);
        if (gameData.victory && gameData.difficulty === 'hard') this.updateDailyChallenge('hard_win', 1);
        
        if (cat === 'musique') this.updateDailyChallenge('play_music', 1);
        if (cat === 'anime') this.updateDailyChallenge('play_anime', 1);
        if (cat === 'culture') this.updateDailyChallenge('play_culture', 1);
        if (cat === 'sport') this.updateDailyChallenge('play_sport', 1);
        if (cat === 'cinema') this.updateDailyChallenge('play_cinema', 1);
        
        let xpEarned = gameData.score * 10;
        if (gameData.victory) xpEarned += 50;
        if (gameData.difficulty === 'hard') xpEarned *= 1.5;
        if (gameData.difficulty === 'expert') xpEarned *= 2;
        
        const leveledUp = this.addXp(Math.floor(xpEarned));
        const newAchievements = this.checkAchievements(gameData);
        const newTitles = this.checkNewTitles();
        
        // === PIÈCES GAGNÉES ===
        let coinsEarned = Math.floor(gameData.score * 2); // 2 pièces par point
        
        // Mode Survie: réduire les gains (sinon trop facile de farmer)
        if (gameData.mode === 'survival') {
            coinsEarned = Math.floor(gameData.score * 0.5); // 0.5 pièce par point en survie
            coinsEarned = Math.min(coinsEarned, 50); // Plafond à 50 pièces max en survie
        }
        
        if (gameData.victory) coinsEarned += 20;
        if (gameData.difficulty === 'hard') coinsEarned = Math.floor(coinsEarned * 1.5);
        if (gameData.difficulty === 'expert') coinsEarned *= 2;
        if (gameData.mode === 'duel' && gameData.victory) coinsEarned += 30;
        if (gameData.mode === 'decade' && gameData.victory) coinsEarned += 15;
        
        this.coins += coinsEarned;
        this.totalCoinsEarned += coinsEarned;
        
        // Stats duel/décennie
        if (gameData.mode === 'duel') {
            this.duelsPlayed++;
            if (gameData.victory) this.duelsWon++;
        }
        if (gameData.mode === 'decade' && gameData.victory) {
            this.decadeGamesWon++;
        }
        
        this.saveData();
        
        return {
            xpEarned: Math.floor(xpEarned),
            coinsEarned,
            leveledUp,
            newLevel: this.level,
            newAchievements,
            newTitles
        };
    }

    // === SYSTÈME DE PIÈCES ===
    
    getCoins() {
        return this.coins;
    }
    
    addCoins(amount) {
        this.coins += amount;
        this.totalCoinsEarned += amount;
        this.saveData();
    }
    
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.saveData();
            return true;
        }
        return false;
    }
    
    // === SYSTÈME DE JOKERS ===
    
    getJokers() {
        return this.jokers;
    }
    
    // === STATISTIQUES DÉTAILLÉES ===
    
    getDetailedStats() {
        const totalVictories = Object.values(this.categoryStats).reduce((sum, cat) => sum + (cat.wins || 0), 0);
        const winRate = this.totalGames > 0 ? Math.round((totalVictories / this.totalGames) * 100) : 0;
        
        return {
            gamesPlayed: this.totalGames || 0,
            victories: totalVictories,
            winRate: winRate,
            correctAnswers: this.totalCorrect || 0,
            bestCombo: this.bestCombo || 0,
            totalCoins: this.totalCoinsEarned || 0,
            totalTime: this.totalPlayTime || 0,
            bestStreak: this.streakDays || 0,
            perfectGames: this.perfectGames || 0,
            bestScore: this.bestScore || 0
        };
    }
    
    useJoker(type) {
        if (this.jokers[type] > 0) {
            this.jokers[type]--;
            this.jokersUsed++;
            this.saveData();
            return true;
        }
        return false;
    }
    
    addJoker(type) {
        this.jokers[type] = (this.jokers[type] || 0) + 1;
        this.saveData();
    }
    
    buyJoker(type, cost) {
        const costs = { fiftyFifty: 100, extraTime: 60, skip: 80 };
        const price = cost || costs[type] || 50;
        
        if (this.spendCoins(price)) {
            this.jokers[type] = (this.jokers[type] || 0) + 1;
            this.saveData();
            return true;
        }
        return false;
    }
    
    // === COFFRES QUOTIDIENS ===
    
    canClaimDailyChest() {
        if (!this.lastChestClaim) return true;
        
        const now = new Date();
        const lastClaim = new Date(this.lastChestClaim);
        const diffHours = (now - lastClaim) / (1000 * 60 * 60);
        
        return diffHours >= 24;
    }
    
    claimDailyChest() {
        if (!this.canClaimDailyChest()) {
            return null;
        }
        
        const now = new Date();
        const lastClaim = this.lastChestClaim ? new Date(this.lastChestClaim) : null;
        
        // Vérifier si c'est consécutif (dans les 48h)
        if (lastClaim) {
            const diffHours = (now - lastClaim) / (1000 * 60 * 60);
            if (diffHours <= 48) {
                this.chestStreak++;
            } else {
                this.chestStreak = 1;
            }
        } else {
            this.chestStreak = 1;
        }
        
        // Récompenses selon le streak
        const rewards = this.getDailyChestRewards();
        
        // Appliquer les récompenses
        this.coins += rewards.coins;
        this.totalCoinsEarned += rewards.coins;
        this.addXp(rewards.xp);
        
        if (rewards.joker) {
            this.jokers[rewards.joker] = (this.jokers[rewards.joker] || 0) + 1;
        }
        
        this.lastChestClaim = now.toISOString();
        this.saveData();
        
        return rewards;
    }
    
    getDailyChestRewards() {
        const streak = Math.min(this.chestStreak, 7);
        
        const rewardTable = {
            1: { coins: 25, xp: 20, joker: null },
            2: { coins: 35, xp: 30, joker: null },
            3: { coins: 50, xp: 40, joker: 'extraTime' },
            4: { coins: 60, xp: 50, joker: null },
            5: { coins: 75, xp: 60, joker: 'fiftyFifty' },
            6: { coins: 100, xp: 80, joker: null },
            7: { coins: 150, xp: 100, joker: 'skip' }
        };
        
        return { ...rewardTable[streak], streak };
    }
    
    getChestStreak() {
        return this.chestStreak;
    }
    
    getTimeUntilNextChest() {
        if (!this.lastChestClaim) return 0;
        
        const now = new Date();
        const lastClaim = new Date(this.lastChestClaim);
        const nextClaim = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
        
        return Math.max(0, nextClaim - now);
    }

    resetProgress() {
        localStorage.removeItem('timeguess_progression');
        this.resetToDefaults();
        this.saveData();
    }
}

window.ProgressionManager = ProgressionManager;
