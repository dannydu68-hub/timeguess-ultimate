/**
 * Translations.js
 * Système de traduction FR/DE
 */

const TRANSLATIONS = {
    fr: {
        // Menu
        menu_title: 'TIMEGUESS',
        menu_subtitle: 'MAÎTRE DU TEMPS',
        menu_pseudo: 'Ton pseudo',
        menu_pseudo_placeholder: 'Entre ton pseudo...',
        menu_play: '▶  JOUER',
        menu_profile: '👤 Profil',
        menu_leaderboard: '🏆 Classement',
        menu_options: '⚙️ Options',
        menu_stats_footer: '🎮 {games} parties • 🏆 Best: {best} • 🔥 Combo: x{combo}',
        menu_instructions: 'Place les événements sur la timeline !',
        
        // Catégories
        category_title: '📚 CHOISIS UNE CATÉGORIE',
        category_mixed: 'Mixte',
        category_mixed_desc: 'Toutes catégories',
        category_music: 'Musique',
        category_music_desc: 'Albums et concerts',
        category_anime: 'Animé',
        category_anime_desc: 'Animés et mangas',
        category_culture: 'Culture G',
        category_culture_desc: 'Histoire et événements',
        category_sport: 'Sport',
        category_sport_desc: 'Événements sportifs',
        category_cinema: 'Cinéma',
        category_cinema_desc: 'Films et séries',
        category_games: 'Jeux Vidéo',
        category_games_desc: 'Sorties de jeux',
        category_sciences: 'Sciences',
        category_sciences_desc: 'Découvertes scientifiques',
        category_geography: 'Géographie',
        category_geography_desc: 'Pays et capitales',
        
        // Modes
        mode_title: 'CHOISIS TON MODE',
        mode_classic: 'Classique',
        mode_classic_desc: 'Atteins 10 points pour gagner',
        mode_classic_detail: '3 vies • 10 questions',
        mode_survival: 'Survie',
        mode_survival_desc: 'Joue jusqu\'à perdre toutes tes vies',
        mode_survival_detail: '3 vies • Questions infinies',
        mode_timeattack: 'Contre-la-montre',
        mode_timeattack_desc: '60 secondes pour un max de points',
        mode_timeattack_detail: 'Pas de vies • Temps limité',
        
        // Difficulté
        difficulty_title: '⚡ CHOISIS LA DIFFICULTÉ',
        difficulty_easy: 'Facile',
        difficulty_easy_desc: '±5 ans de marge • 20 secondes',
        difficulty_normal: 'Normal',
        difficulty_normal_desc: '±2 ans de marge • 15 secondes',
        difficulty_hard: 'Difficile',
        difficulty_hard_desc: '±1 an de marge • 10 secondes',
        difficulty_expert: 'Expert',
        difficulty_expert_desc: 'Année exacte • 5 secondes',
        
        // Jeu
        game_validate: '✓ VALIDER',
        game_pause: 'PAUSE',
        game_resume: '▶ REPRENDRE',
        game_menu: '🏠 MENU',
        game_time_up: 'TEMPS ÉCOULÉ !',
        game_correct: 'CORRECT !',
        game_wrong: 'FAUX !',
        
        // Résultats
        result_victory: 'VICTOIRE !',
        result_gameover: 'GAME OVER',
        result_mode: 'Mode {mode}',
        result_stats: '📊 STATS',
        result_score: 'Score',
        result_combo: 'Combo max',
        result_lives: 'Vies',
        result_progression: '⭐ PROGRESSION',
        result_xp: '+{xp} XP',
        result_levelup: '🎉 NIVEAU {level} !',
        result_achievements: '🏆 SUCCÈS DÉBLOQUÉS !',
        result_replay: '🔄 Rejouer',
        result_menu: '🏠 Menu',
        
        // Profil
        profile_level: 'NIVEAU {level}',
        profile_stats: '📊 Stats',
        profile_achievements: '🏆 Succès',
        profile_themes: '🎨 Thèmes',
        profile_avatars: '👤 Avatars',
        profile_games_played: 'Parties jouées',
        profile_correct_answers: 'Réponses correctes',
        profile_best_score: 'Meilleur score',
        profile_best_combo: 'Meilleur combo',
        profile_total_xp: 'XP total',
        profile_achievements_unlocked: 'Succès débloqués',
        profile_active: '✓ Actif',
        
        // Leaderboard
        leaderboard_title: '🏆 CLASSEMENT',
        leaderboard_empty: 'Aucun score enregistré\nJoue une partie pour apparaître ici !',
        leaderboard_player: 'Joueur',
        leaderboard_score: 'Score',
        leaderboard_mode: 'Mode',
        leaderboard_difficulty: 'Difficulté',
        
        // Options
        settings_title: '⚙️ PARAMÈTRES',
        settings_music_volume: '🎵 Volume Musique',
        settings_sfx_volume: '🔊 Volume Effets Sonores',
        settings_apply: '✓ APPLIQUER',
        settings_applied: '✓ APPLIQUÉ !',
        settings_back: '⬅️ RETOUR AU MENU',
        settings_reset: '🗑️ RESET STATS',
        settings_reset_confirm: 'Êtes-vous sûr de vouloir réinitialiser toutes les statistiques ?',
        settings_reset_done: 'Statistiques réinitialisées !',
        settings_language: '🌍 Langue',
        
        // Succès
        achievement_first_win: 'Première Victoire',
        achievement_first_win_desc: 'Gagne ta première partie',
        achievement_perfect: 'Sans Faute',
        achievement_perfect_desc: 'Fais 10/10 sans erreur',
        achievement_combo3: 'Combo Débutant',
        achievement_combo3_desc: 'Atteins un combo x3',
        achievement_combo5: 'Combo Master',
        achievement_combo5_desc: 'Atteins un combo x5',
        achievement_combo10: 'Combo Légendaire',
        achievement_combo10_desc: 'Atteins un combo x10',
        achievement_speed: 'Speed Demon',
        achievement_speed_desc: 'Réponds en moins de 2 secondes',
        achievement_survivor: 'Survivant',
        achievement_survivor_desc: 'Atteins 20 points en mode Survie',
        achievement_immortal: 'Immortel',
        achievement_immortal_desc: 'Atteins 50 points en mode Survie',
        achievement_timeattack: 'Contre la Montre',
        achievement_timeattack_desc: '30 points en mode Chrono',
        achievement_games10: 'Habitué',
        achievement_games10_desc: 'Joue 10 parties',
        achievement_games50: 'Vétéran',
        achievement_games50_desc: 'Joue 50 parties',
        achievement_games100: 'Légende',
        achievement_games100_desc: 'Joue 100 parties',
        achievement_expert: 'Expert',
        achievement_expert_desc: 'Gagne une partie en mode Expert',
        achievement_level5: 'Apprenti',
        achievement_level5_desc: 'Atteins le niveau 5',
        achievement_level10: 'Confirmé',
        achievement_level10_desc: 'Atteins le niveau 10',
        achievement_level20: 'Maître du Temps',
        achievement_level20_desc: 'Atteins le niveau 20',
        
        // Thèmes
        theme_default: 'Classique',
        theme_neon: 'Néon',
        theme_retro: 'Rétro',
        theme_nature: 'Nature',
        theme_gold: 'Or',
        theme_galaxy: 'Galaxie',
    },
    
    de: {
        // Menu
        menu_title: 'TIMEGUESS',
        menu_subtitle: 'MEISTER DER ZEIT',
        menu_pseudo: 'Dein Name',
        menu_pseudo_placeholder: 'Gib deinen Namen ein...',
        menu_play: '▶  SPIELEN',
        menu_profile: '👤 Profil',
        menu_leaderboard: '🏆 Rangliste',
        menu_options: '⚙️ Optionen',
        menu_stats_footer: '🎮 {games} Spiele • 🏆 Best: {best} • 🔥 Combo: x{combo}',
        menu_instructions: 'Platziere die Ereignisse auf der Zeitleiste!',
        
        // Catégories
        category_title: '📚 WÄHLE EINE KATEGORIE',
        category_mixed: 'Gemischt',
        category_mixed_desc: 'Alle Kategorien',
        category_music: 'Musik',
        category_music_desc: 'Alben und Konzerte',
        category_anime: 'Anime',
        category_anime_desc: 'Anime und Manga',
        category_culture: 'Allgemeinwissen',
        category_culture_desc: 'Geschichte und Ereignisse',
        category_sport: 'Sport',
        category_sport_desc: 'Sportereignisse',
        category_cinema: 'Kino',
        category_cinema_desc: 'Filme und Serien',
        category_games: 'Videospiele',
        category_games_desc: 'Spielveröffentlichungen',
        category_sciences: 'Wissenschaft',
        category_sciences_desc: 'Entdeckungen',
        category_geography: 'Geographie',
        category_geography_desc: 'Länder und Städte',
        
        // Modes
        mode_title: 'WÄHLE DEINEN MODUS',
        mode_classic: 'Klassisch',
        mode_classic_desc: 'Erreiche 10 Punkte zum Gewinnen',
        mode_classic_detail: '3 Leben • 10 Fragen',
        mode_survival: 'Überleben',
        mode_survival_desc: 'Spiele bis du alle Leben verlierst',
        mode_survival_detail: '3 Leben • Unendliche Fragen',
        mode_timeattack: 'Zeitangriff',
        mode_timeattack_desc: '60 Sekunden für maximale Punkte',
        mode_timeattack_detail: 'Keine Leben • Begrenzte Zeit',
        
        // Difficulté
        difficulty_title: '⚡ WÄHLE DIE SCHWIERIGKEIT',
        difficulty_easy: 'Einfach',
        difficulty_easy_desc: '±5 Jahre Toleranz • 20 Sekunden',
        difficulty_normal: 'Normal',
        difficulty_normal_desc: '±2 Jahre Toleranz • 15 Sekunden',
        difficulty_hard: 'Schwer',
        difficulty_hard_desc: '±1 Jahr Toleranz • 10 Sekunden',
        difficulty_expert: 'Experte',
        difficulty_expert_desc: 'Exaktes Jahr • 5 Sekunden',
        
        // Jeu
        game_validate: '✓ BESTÄTIGEN',
        game_pause: 'PAUSE',
        game_resume: '▶ FORTSETZEN',
        game_menu: '🏠 MENÜ',
        game_time_up: 'ZEIT ABGELAUFEN!',
        game_correct: 'RICHTIG!',
        game_wrong: 'FALSCH!',
        
        // Résultats
        result_victory: 'SIEG!',
        result_gameover: 'SPIEL VORBEI',
        result_mode: 'Modus {mode}',
        result_stats: '📊 STATISTIK',
        result_score: 'Punkte',
        result_combo: 'Max Combo',
        result_lives: 'Leben',
        result_progression: '⭐ FORTSCHRITT',
        result_xp: '+{xp} XP',
        result_levelup: '🎉 LEVEL {level}!',
        result_achievements: '🏆 ERFOLGE FREIGESCHALTET!',
        result_replay: '🔄 Nochmal',
        result_menu: '🏠 Menü',
        
        // Profil
        profile_level: 'LEVEL {level}',
        profile_stats: '📊 Statistik',
        profile_achievements: '🏆 Erfolge',
        profile_themes: '🎨 Themen',
        profile_avatars: '👤 Avatare',
        profile_games_played: 'Gespielte Spiele',
        profile_correct_answers: 'Richtige Antworten',
        profile_best_score: 'Beste Punktzahl',
        profile_best_combo: 'Bestes Combo',
        profile_total_xp: 'Gesamt XP',
        profile_achievements_unlocked: 'Erfolge freigeschaltet',
        profile_active: '✓ Aktiv',
        
        // Leaderboard
        leaderboard_title: '🏆 RANGLISTE',
        leaderboard_empty: 'Keine Ergebnisse\nSpiele ein Spiel um hier zu erscheinen!',
        leaderboard_player: 'Spieler',
        leaderboard_score: 'Punkte',
        leaderboard_mode: 'Modus',
        leaderboard_difficulty: 'Schwierigkeit',
        
        // Options
        settings_title: '⚙️ EINSTELLUNGEN',
        settings_music_volume: '🎵 Musik Lautstärke',
        settings_sfx_volume: '🔊 Effekte Lautstärke',
        settings_apply: '✓ ANWENDEN',
        settings_applied: '✓ ANGEWENDET!',
        settings_back: '⬅️ ZURÜCK ZUM MENÜ',
        settings_reset: '🗑️ STATISTIK ZURÜCKSETZEN',
        settings_reset_confirm: 'Bist du sicher, dass du alle Statistiken zurücksetzen möchtest?',
        settings_reset_done: 'Statistiken zurückgesetzt!',
        settings_language: '🌍 Sprache',
        
        // Succès
        achievement_first_win: 'Erster Sieg',
        achievement_first_win_desc: 'Gewinne dein erstes Spiel',
        achievement_perfect: 'Perfekt',
        achievement_perfect_desc: 'Schaffe 10/10 ohne Fehler',
        achievement_combo3: 'Combo Anfänger',
        achievement_combo3_desc: 'Erreiche ein x3 Combo',
        achievement_combo5: 'Combo Meister',
        achievement_combo5_desc: 'Erreiche ein x5 Combo',
        achievement_combo10: 'Combo Legende',
        achievement_combo10_desc: 'Erreiche ein x10 Combo',
        achievement_speed: 'Blitzschnell',
        achievement_speed_desc: 'Antworte in unter 2 Sekunden',
        achievement_survivor: 'Überlebender',
        achievement_survivor_desc: '20 Punkte im Überlebensmodus',
        achievement_immortal: 'Unsterblich',
        achievement_immortal_desc: '50 Punkte im Überlebensmodus',
        achievement_timeattack: 'Zeitjäger',
        achievement_timeattack_desc: '30 Punkte im Zeitangriff',
        achievement_games10: 'Stammgast',
        achievement_games10_desc: 'Spiele 10 Spiele',
        achievement_games50: 'Veteran',
        achievement_games50_desc: 'Spiele 50 Spiele',
        achievement_games100: 'Legende',
        achievement_games100_desc: 'Spiele 100 Spiele',
        achievement_expert: 'Experte',
        achievement_expert_desc: 'Gewinne im Experten-Modus',
        achievement_level5: 'Lehrling',
        achievement_level5_desc: 'Erreiche Level 5',
        achievement_level10: 'Fortgeschritten',
        achievement_level10_desc: 'Erreiche Level 10',
        achievement_level20: 'Zeitmeister',
        achievement_level20_desc: 'Erreiche Level 20',
        
        // Thèmes
        theme_default: 'Klassisch',
        theme_neon: 'Neon',
        theme_retro: 'Retro',
        theme_nature: 'Natur',
        theme_gold: 'Gold',
        theme_galaxy: 'Galaxie',
    },
    
    en: {
        // Menu
        menu_title: 'TIMEGUESS',
        menu_subtitle: 'MASTER OF TIME',
        menu_pseudo: 'Your name',
        menu_pseudo_placeholder: 'Enter your name...',
        menu_play: '▶  PLAY',
        menu_profile: '👤 Profile',
        menu_leaderboard: '🏆 Leaderboard',
        menu_options: '⚙️ Settings',
        menu_stats_footer: '🎮 {games} games • 🏆 Best: {best} • 🔥 Combo: x{combo}',
        menu_instructions: 'Place events on the timeline!',
        menu_settings: '⚙️ Settings',
        
        // Catégories
        category_title: '📚 CHOOSE A CATEGORY',
        category_mixed: 'Mixed',
        category_mixed_desc: 'All categories',
        category_music: 'Music',
        category_music_desc: 'Albums and concerts',
        category_anime: 'Anime',
        category_anime_desc: 'Anime and manga',
        category_culture: 'General Knowledge',
        category_culture_desc: 'History and events',
        category_sport: 'Sports',
        category_sport_desc: 'Sports events',
        category_cinema: 'Cinema',
        category_cinema_desc: 'Movies and series',
        category_games: 'Video Games',
        category_games_desc: 'Game releases',
        category_sciences: 'Science',
        category_sciences_desc: 'Discoveries',
        category_geography: 'Geography',
        category_geography_desc: 'Countries and cities',
        
        // Modes
        mode_title: 'CHOOSE YOUR MODE',
        mode_classic: 'Classic',
        mode_classic_desc: 'Reach 10 points to win',
        mode_classic_detail: '3 lives • 10 questions',
        mode_survival: 'Survival',
        mode_survival_desc: 'Play until you lose all lives',
        mode_survival_detail: '3 lives • Infinite questions',
        mode_timeattack: 'Time Attack',
        mode_timeattack_desc: '60 seconds for max points',
        mode_timeattack_detail: 'No lives • Limited time',
        
        // Difficulté
        difficulty_title: '⚡ CHOOSE DIFFICULTY',
        difficulty_easy: 'Easy',
        difficulty_easy_desc: '±5 years margin • 20 seconds',
        difficulty_normal: 'Normal',
        difficulty_normal_desc: '±2 years margin • 15 seconds',
        difficulty_hard: 'Hard',
        difficulty_hard_desc: '±1 year margin • 10 seconds',
        difficulty_expert: 'Expert',
        difficulty_expert_desc: 'Exact year • 5 seconds',
        
        // Jeu
        game_validate: '✓ VALIDATE',
        game_pause: 'PAUSE',
        game_resume: '▶ RESUME',
        game_menu: '🏠 MENU',
        game_time_up: 'TIME\'S UP!',
        game_correct: 'CORRECT!',
        game_wrong: 'WRONG!',
        
        // Résultats
        result_victory: 'VICTORY!',
        result_gameover: 'GAME OVER',
        result_mode: 'Mode {mode}',
        result_stats: '📊 STATS',
        result_score: 'Score',
        result_combo: 'Max Combo',
        result_lives: 'Lives',
        result_progression: '⭐ PROGRESSION',
        result_xp: '+{xp} XP',
        result_levelup: '🎉 LEVEL {level}!',
        result_achievements: '🏆 ACHIEVEMENTS UNLOCKED!',
        result_replay: '🔄 Replay',
        result_menu: '🏠 Menu',
        
        // Profil
        profile_level: 'LEVEL {level}',
        profile_stats: '📊 Stats',
        profile_achievements: '🏆 Achievements',
        profile_themes: '🎨 Themes',
        profile_avatars: '👤 Avatars',
        profile_games_played: 'Games played',
        profile_correct_answers: 'Correct answers',
        profile_best_score: 'Best score',
        profile_best_combo: 'Best combo',
        profile_total_xp: 'Total XP',
        profile_achievements_unlocked: 'Achievements unlocked',
        profile_active: '✓ Active',
        
        // Leaderboard
        leaderboard_title: '🏆 LEADERBOARD',
        leaderboard_empty: 'No scores yet\nPlay a game to appear here!',
        leaderboard_player: 'Player',
        leaderboard_score: 'Score',
        leaderboard_mode: 'Mode',
        leaderboard_difficulty: 'Difficulty',
        
        // Options
        settings_title: '⚙️ SETTINGS',
        settings_music_volume: '🎵 Music Volume',
        settings_sfx_volume: '🔊 Sound Effects Volume',
        settings_apply: '✓ APPLY',
        settings_applied: '✓ APPLIED!',
        settings_back: '⬅️ BACK TO MENU',
        settings_reset: '🗑️ RESET STATS',
        settings_reset_confirm: 'Are you sure you want to reset all statistics?',
        settings_reset_done: 'Statistics reset!',
        settings_language: '🌍 Language',
        
        // Succès
        achievement_first_win: 'First Victory',
        achievement_first_win_desc: 'Win your first game',
        achievement_perfect: 'Perfect',
        achievement_perfect_desc: 'Get 10/10 without errors',
        achievement_combo3: 'Combo Beginner',
        achievement_combo3_desc: 'Reach a x3 combo',
        achievement_combo5: 'Combo Master',
        achievement_combo5_desc: 'Reach a x5 combo',
        achievement_combo10: 'Combo Legend',
        achievement_combo10_desc: 'Reach a x10 combo',
        achievement_speed: 'Speed Demon',
        achievement_speed_desc: 'Answer in under 2 seconds',
        achievement_survivor: 'Survivor',
        achievement_survivor_desc: '20 points in Survival mode',
        achievement_immortal: 'Immortal',
        achievement_immortal_desc: '50 points in Survival mode',
        achievement_timeattack: 'Time Hunter',
        achievement_timeattack_desc: '30 points in Time Attack',
        achievement_games10: 'Regular',
        achievement_games10_desc: 'Play 10 games',
        achievement_games50: 'Veteran',
        achievement_games50_desc: 'Play 50 games',
        achievement_games100: 'Legend',
        achievement_games100_desc: 'Play 100 games',
        achievement_expert: 'Expert',
        achievement_expert_desc: 'Win in Expert mode',
        achievement_level5: 'Apprentice',
        achievement_level5_desc: 'Reach level 5',
        achievement_level10: 'Advanced',
        achievement_level10_desc: 'Reach level 10',
        achievement_level20: 'Time Master',
        achievement_level20_desc: 'Reach level 20',
        
        // Thèmes
        theme_default: 'Classic',
        theme_neon: 'Neon',
        theme_retro: 'Retro',
        theme_nature: 'Nature',
        theme_gold: 'Gold',
        theme_galaxy: 'Galaxy',
    }
};

/**
 * Gestionnaire de langue
 */
class LanguageManager {
    constructor() {
        this.currentLang = this.loadLanguage();
    }
    
    loadLanguage() {
        try {
            const saved = localStorage.getItem('timeguess_language');
            return saved || 'fr';
        } catch (e) {
            return 'fr';
        }
    }
    
    saveLanguage(lang) {
        try {
            localStorage.setItem('timeguess_language', lang);
            this.currentLang = lang;
        } catch (e) {}
    }
    
    setLanguage(lang) {
        if (TRANSLATIONS[lang]) {
            this.saveLanguage(lang);
            return true;
        }
        return false;
    }
    
    getLanguage() {
        return this.currentLang;
    }
    
    /**
     * Obtient une traduction
     * @param {string} key - Clé de traduction
     * @param {object} params - Paramètres optionnels pour le remplacement
     */
    t(key, params = {}) {
        const translations = TRANSLATIONS[this.currentLang] || TRANSLATIONS['fr'];
        let text = translations[key] || TRANSLATIONS['fr'][key] || key;
        
        // Remplacer les paramètres {param}
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    }
}

// Instance globale
window.TRANSLATIONS = TRANSLATIONS;
window.LanguageManager = LanguageManager;
