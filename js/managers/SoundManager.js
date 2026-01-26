/**
 * SoundManager.js
 * Gestionnaire de sons avec musique ambiante relaxante
 */

class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.audioContext = null;
        this.musicPlaying = false;
        this.musicNodes = [];
        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.musicTimeout = null;
        
        // Charger les paramètres
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('timeline_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.musicVolume = settings.musicVolume ?? 0.3;
                this.sfxVolume = settings.sfxVolume ?? 0.5;
                this.musicEnabled = settings.musicEnabled ?? true;
            } else {
                this.musicVolume = 0.3;
                this.sfxVolume = 0.5;
                this.musicEnabled = true;
            }
        } catch (e) {
            this.musicVolume = 0.3;
            this.sfxVolume = 0.5;
            this.musicEnabled = true;
        }
    }

    /**
     * Initialise le contexte audio
     */
    initAudio() {
        if (this.audioContext) return true;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return false;
            
            this.audioContext = new AudioContext();
            
            // Master gain
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            
            // Music gain
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            // SFX gain
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
            return true;
        } catch (e) {
            console.log('Audio non disponible:', e);
            return false;
        }
    }

    /**
     * Joue la musique de fond ambiante
     */
    playBackgroundMusic() {
        if (this.musicPlaying) return;
        
        this.loadSettings();
        
        if (!this.musicEnabled) {
            console.log('🔇 Musique désactivée');
            return;
        }
        
        if (!this.initAudio()) return;
        
        this.musicPlaying = true;
        console.log('🎵 Démarrage musique ambiante...');
        
        this.playAmbientLoop();
    }

    /**
     * Musique ambiante douce en boucle
     */
    playAmbientLoop() {
        if (!this.musicPlaying || !this.audioContext) return;

        const now = this.audioContext.currentTime;
        
        // Accords doux et lents (style ambient/chill)
        const chordProgression = [
            // Am7 - Doux et mélancolique
            { notes: [220, 261.63, 329.63, 392], duration: 4 },
            // Fmaj7 - Chaleureux
            { notes: [174.61, 220, 261.63, 329.63], duration: 4 },
            // Cmaj7 - Lumineux
            { notes: [130.81, 164.81, 196, 246.94], duration: 4 },
            // G - Résolution
            { notes: [196, 246.94, 293.66, 392], duration: 4 },
            // Em7 - Introspectif
            { notes: [164.81, 196, 246.94, 293.66], duration: 4 },
            // Dm7 - Doux
            { notes: [146.83, 174.61, 220, 261.63], duration: 4 },
            // Am - Retour
            { notes: [110, 130.81, 164.81, 220], duration: 4 },
            // E - Tension douce
            { notes: [164.81, 207.65, 246.94, 329.63], duration: 4 },
        ];

        let time = now;
        
        // Jouer la progression complète (32 secondes)
        chordProgression.forEach((chord, index) => {
            this.playAmbientChord(chord.notes, time, chord.duration);
            time += chord.duration;
        });

        // Boucler après 32 secondes
        this.musicTimeout = setTimeout(() => {
            if (this.musicPlaying) {
                this.playAmbientLoop();
            }
        }, 32000);
    }

    /**
     * Joue un accord ambient doux
     */
    playAmbientChord(frequencies, startTime, duration) {
        if (!this.audioContext || !this.musicPlaying) return;

        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            // Utiliser des ondes douces
            osc.type = index === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;
            
            // Légère désynchronisation pour un son plus riche
            osc.detune.value = (Math.random() - 0.5) * 10;
            
            osc.connect(gain);
            gain.connect(this.musicGain);
            
            // Envelope très douce (fade in/out lent)
            const volume = 0.08 - (index * 0.015); // Notes hautes plus douces
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(volume, startTime + 1.5); // Fade in lent
            gain.gain.setValueAtTime(volume, startTime + duration - 1.5);
            gain.gain.linearRampToValueAtTime(0, startTime + duration); // Fade out lent
            
            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
            
            this.musicNodes.push({ osc, gain });
        });
    }

    /**
     * Arrête la musique
     */
    stopMusic() {
        this.musicPlaying = false;
        
        if (this.musicTimeout) {
            clearTimeout(this.musicTimeout);
            this.musicTimeout = null;
        }
        
        // Fade out tous les nodes
        this.musicNodes.forEach(node => {
            try {
                if (node.gain && this.audioContext) {
                    node.gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
                }
                if (node.osc) {
                    node.osc.stop(this.audioContext.currentTime + 0.6);
                }
            } catch (e) {}
        });
        
        this.musicNodes = [];
        console.log('🔇 Musique arrêtée');
    }

    /**
     * Change le volume de la musique
     */
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.musicGain && this.audioContext) {
            this.musicGain.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.1);
        }
    }

    /**
     * Change le volume des effets sonores
     */
    setSFXVolume(volume) {
        this.sfxVolume = volume;
        if (this.sfxGain && this.audioContext) {
            this.sfxGain.gain.value = volume;
        }
    }

    /**
     * Active/désactive la musique
     */
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (enabled && !this.musicPlaying) {
            this.playBackgroundMusic();
        } else if (!enabled && this.musicPlaying) {
            this.stopMusic();
        }
    }

    /**
     * Applique les paramètres depuis le localStorage
     */
    applySettings() {
        this.loadSettings();
        this.setMusicVolume(this.musicVolume);
        this.setSFXVolume(this.sfxVolume);
        
        if (this.musicEnabled && !this.musicPlaying) {
            this.playBackgroundMusic();
        } else if (!this.musicEnabled && this.musicPlaying) {
            this.stopMusic();
        }
    }

    // === EFFETS SONORES ===

    /**
     * Joue un beep
     */
    playBeep(frequency, duration, volume = 0.3) {
        if (!this.initAudio()) return;
        
        try {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.frequency.value = frequency;
            osc.type = 'sine';

            const now = this.audioContext.currentTime;
            gain.gain.setValueAtTime(volume, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {}
    }

    /**
     * Son de bonne réponse
     */
    playCorrectSound() {
        this.playBeep(523.25, 0.1, 0.3); // C5
        setTimeout(() => this.playBeep(659.25, 0.1, 0.3), 100); // E5
        setTimeout(() => this.playBeep(783.99, 0.15, 0.3), 200); // G5
    }

    /**
     * Son de mauvaise réponse
     */
    playWrongSound() {
        this.playBeep(200, 0.3, 0.4);
        setTimeout(() => this.playBeep(150, 0.3, 0.3), 150);
    }

    /**
     * Son de clic
     */
    playClickSound() {
        this.playBeep(600, 0.05, 0.2);
    }

    /**
     * Son de victoire
     */
    playVictorySound() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((note, i) => {
            setTimeout(() => this.playBeep(note, 0.2, 0.3), i * 150);
        });
    }

    /**
     * Son de tick (timer)
     */
    playTickSound() {
        this.playBeep(1000, 0.03, 0.15);
    }
}

window.SoundManager = SoundManager;
