/**
 * FirebaseManager.js
 * Gère la connexion Firebase et le classement global
 */

class FirebaseManager {
    constructor() {
        this.db = null;
        this.initialized = false;
        this.init();
    }

    init() {
        try {
            // Configuration Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyBPENUyRJzBkBc0ODCtnhDC4GrdAgiEyJw",
                authDomain: "timeguess-e43c0.firebaseapp.com",
                databaseURL: "https://timeguess-e43c0-default-rtdb.europe-west1.firebasedatabase.app",
                projectId: "timeguess-e43c0",
                storageBucket: "timeguess-e43c0.firebasestorage.app",
                messagingSenderId: "108858182755",
                appId: "1:108858182755:web:82c3cabb4a313c32893c56"
            };

            // Initialiser Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.database();
            this.initialized = true;
            console.log('✅ Firebase connecté !');
        } catch (error) {
            console.error('❌ Erreur Firebase:', error);
            this.initialized = false;
        }
    }

    // === SOUMETTRE UN SCORE ===
    async submitScore(playerName, scoreData) {
        if (!this.initialized || !this.db) {
            console.warn('Firebase non initialisé');
            return false;
        }

        try {
            const entry = {
                name: playerName.substring(0, 20), // Max 20 caractères
                score: scoreData.score,
                mode: scoreData.mode,
                category: scoreData.category,
                difficulty: scoreData.difficulty,
                correctAnswers: scoreData.correctAnswers || 0,
                maxCombo: scoreData.maxCombo || 0,
                time: scoreData.time || 0,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                date: new Date().toISOString().split('T')[0]
            };

            // Sauvegarder dans le classement général
            await this.db.ref('leaderboard/all').push(entry);
            
            // Sauvegarder par mode
            await this.db.ref(`leaderboard/mode/${scoreData.mode}`).push(entry);
            
            // Sauvegarder par catégorie
            await this.db.ref(`leaderboard/category/${scoreData.category}`).push(entry);

            console.log('✅ Score soumis au classement global !');
            return true;
        } catch (error) {
            console.error('❌ Erreur soumission score:', error);
            return false;
        }
    }

    // === RÉCUPÉRER LE CLASSEMENT ===
    async getLeaderboard(type = 'all', filter = null, limit = 50) {
        if (!this.initialized || !this.db) {
            console.warn('Firebase non initialisé');
            return [];
        }

        try {
            let ref;
            
            if (type === 'all') {
                ref = this.db.ref('leaderboard/all');
            } else if (type === 'mode' && filter) {
                ref = this.db.ref(`leaderboard/mode/${filter}`);
            } else if (type === 'category' && filter) {
                ref = this.db.ref(`leaderboard/category/${filter}`);
            } else {
                ref = this.db.ref('leaderboard/all');
            }

            const snapshot = await ref
                .orderByChild('score')
                .limitToLast(limit)
                .once('value');

            const scores = [];
            snapshot.forEach(child => {
                scores.push({
                    id: child.key,
                    ...child.val()
                });
            });

            // Trier par score décroissant
            scores.sort((a, b) => b.score - a.score);
            
            return scores;
        } catch (error) {
            console.error('❌ Erreur récupération classement:', error);
            return [];
        }
    }

    // === RÉCUPÉRER LE CLASSEMENT DU JOUR ===
    async getDailyLeaderboard(limit = 20) {
        if (!this.initialized || !this.db) return [];

        try {
            const today = new Date().toISOString().split('T')[0];
            
            const snapshot = await this.db.ref('leaderboard/all')
                .orderByChild('date')
                .equalTo(today)
                .once('value');

            const scores = [];
            snapshot.forEach(child => {
                scores.push({
                    id: child.key,
                    ...child.val()
                });
            });

            scores.sort((a, b) => b.score - a.score);
            return scores.slice(0, limit);
        } catch (error) {
            console.error('❌ Erreur classement du jour:', error);
            return [];
        }
    }

    // === OBTENIR LE RANG D'UN JOUEUR ===
    async getPlayerRank(playerName, mode = 'all') {
        const leaderboard = await this.getLeaderboard(mode === 'all' ? 'all' : 'mode', mode, 1000);
        
        // Trouver le meilleur score du joueur
        const playerScores = leaderboard.filter(s => s.name === playerName);
        if (playerScores.length === 0) return null;
        
        const bestScore = Math.max(...playerScores.map(s => s.score));
        const rank = leaderboard.findIndex(s => s.name === playerName && s.score === bestScore) + 1;
        
        return {
            rank,
            totalPlayers: new Set(leaderboard.map(s => s.name)).size,
            bestScore
        };
    }

    // === STATISTIQUES GLOBALES ===
    async getGlobalStats() {
        if (!this.initialized || !this.db) return null;

        try {
            const snapshot = await this.db.ref('leaderboard/all').once('value');
            const data = snapshot.val();
            
            if (!data) return { totalGames: 0, totalPlayers: 0 };
            
            const entries = Object.values(data);
            const uniquePlayers = new Set(entries.map(e => e.name));
            
            return {
                totalGames: entries.length,
                totalPlayers: uniquePlayers.size
            };
        } catch (error) {
            console.error('❌ Erreur stats globales:', error);
            return { totalGames: 0, totalPlayers: 0 };
        }
    }
}

window.FirebaseManager = FirebaseManager;
