/**
 * config.js
 * Configuration globale du jeu Timeline Battle Solo
 */

const CONFIG = {
    // ========================================
    // JEU
    // ========================================
    GAME: {
        WIDTH: 1280,
        HEIGHT: 720,
        BACKGROUND_COLOR: '#1a1a2e',
        SCORE_TO_WIN: 10 // Points pour gagner
    },
    
    // ========================================
    // TIMELINE
    // ========================================
    TIMELINE: {
        X: 90,
        Y: 440,
        WIDTH: 1100,
        HEIGHT: 8,
        COLOR: 0xFFFFFF
    },
    
    // ========================================
    // COULEURS
    // ========================================
    COLORS: [
        { name: 'Rouge', hex: '#FF6B6B', value: 0xFF6B6B },
        { name: 'Bleu', hex: '#4ECDC4', value: 0x4ECDC4 },
        { name: 'Vert', hex: '#95E1D3', value: 0x95E1D3 },
        { name: 'Jaune', hex: '#F7DC6F', value: 0xF7DC6F },
        { name: 'Violet', hex: '#BB8FCE', value: 0xBB8FCE },
        { name: 'Orange', hex: '#FF6B9D', value: 0xFF6B9D },
        { name: 'Rose', hex: '#FFAAA5', value: 0xFFAAA5 },
        { name: 'Cyan', hex: '#92C9E8', value: 0x92C9E8 }
    ],
    
    // ========================================
    // UI
    // ========================================
    UI: {
        FONT_FAMILY: 'Arial, sans-serif',
        TEXT_COLOR: '#FFFFFF',
        BUTTON_COLOR: 0x667EEA,
        BUTTON_HOVER_COLOR: 0x5a67d8
    }
};

// Rendre accessible globalement
window.CONFIG = CONFIG;
