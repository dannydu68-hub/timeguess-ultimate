/**
 * main.js
 * Point d'entrée du jeu TIMEGUESS
 */

// Détecter si on est sur mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const config = {
    type: Phaser.AUTO,
    width: CONFIG.GAME.WIDTH,
    height: CONFIG.GAME.HEIGHT,
    backgroundColor: CONFIG.GAME.BACKGROUND_COLOR,
    parent: 'game-container',
    fps: {
        target: 60,
        forceSetTimeOut: false
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: CONFIG.GAME.WIDTH,
        height: CONFIG.GAME.HEIGHT,
        fullscreenTarget: 'game-container'
    },
    input: {
        activePointers: 3,
        touch: {
            capture: true
        }
    },
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false
    },
    scene: [
        LanguageScene,
        MenuScene, 
        SettingsScene, 
        StatsScene, 
        PauseScene, 
        CategoryScene, 
        ModeScene,
        DifficultyScene, 
        TransitionScene, 
        GameScene, 
        ResultScene,
        ProfileScene,
        LeaderboardScene,
        GlobalLeaderboardScene,
        TutorialScene
    ]
};

const game = new Phaser.Game(config);

// Initialiser Firebase pour le classement global
game.firebase = new FirebaseManager();

// ============ GESTION MOBILE PLEIN ÉCRAN ============

// Fonction pour activer le plein écran
function enterFullscreen() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    
    // Verrouiller l'orientation en paysage si possible
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(() => {});
    }
}

// Fonction pour vérifier et afficher l'overlay d'orientation
function checkOrientation() {
    const overlay = document.getElementById('orientation-overlay');
    if (!overlay) return;
    
    const isPortrait = window.innerHeight > window.innerWidth;
    
    if (isMobile && isPortrait) {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// Sur mobile, activer plein écran au premier touch
if (isMobile) {
    let fullscreenActivated = false;
    
    const activateFullscreen = () => {
        if (!fullscreenActivated) {
            fullscreenActivated = true;
            enterFullscreen();
            document.removeEventListener('touchstart', activateFullscreen);
            document.removeEventListener('click', activateFullscreen);
        }
    };
    
    document.addEventListener('touchstart', activateFullscreen, { once: true });
    document.addEventListener('click', activateFullscreen, { once: true });
    
    // Vérifier l'orientation au chargement
    checkOrientation();
}

// Empêcher le zoom par pinch sur mobile
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
});

document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Redimensionner correctement sur changement d'orientation
window.addEventListener('resize', () => {
    if (game && game.scale) {
        game.scale.refresh();
    }
    checkOrientation();
});

window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (game && game.scale) {
            game.scale.refresh();
        }
        checkOrientation();
    }, 200);
});
