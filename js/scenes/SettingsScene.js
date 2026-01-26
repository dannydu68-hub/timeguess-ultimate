/**
 * SettingsScene.js
 * Menu de paramètres avec traductions et design amélioré
 */

class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    preload() {
        if (!this.textures.exists('background_night')) {
            this.load.image('background_night', 'assets/images/background_night.png?v=110');
        }
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
        if (!this.textures.exists('frame_question')) {
            this.load.image('frame_question', 'assets/images/frame_question.png?v=110');
        }
        if (!this.textures.exists('btn_validate')) {
            this.load.image('btn_validate', 'assets/images/btn_validate.png?v=110');
        }
        // Drapeaux pour sélection de langue
        if (!this.textures.exists('flag_fr_big')) {
            this.load.image('flag_fr_big', 'assets/images/flag_fr_big.png?v=145');
        }
        if (!this.textures.exists('flag_en_big')) {
            this.load.image('flag_en_big', 'assets/images/flag_en_big.png?v=145');
        }
        if (!this.textures.exists('flag_de_big')) {
            this.load.image('flag_de_big', 'assets/images/flag_de_big.png?v=145');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        
        this.createBackground(width, height);
        this.createTitle(width);
        
        const savedSettings = this.loadSettings();
        this.musicVolume = savedSettings.musicVolume;
        this.sfxVolume = savedSettings.sfxVolume;
        this.musicEnabled = savedSettings.musicEnabled;

        this.createMusicSection(width);
        this.createSFXSection(width);
        this.createLanguageSection(width);
        this.createButtons(width, height);
        
        this.cameras.main.fadeIn(300);
    }

    createBackground(width, height) {
        // Image de fond - nuit étoilée
        const bg = this.add.image(width / 2, height / 2, 'background_night');
        bg.setDisplaySize(width, height);
        
        // Particules décoratives
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, width - 50);
            const y = Phaser.Math.Between(50, height - 50);
            const size = Phaser.Math.Between(1, 3);
            const star = this.add.circle(x, y, size, 0xFFFFFF, Phaser.Math.FloatBetween(0.1, 0.4));
            
            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: star.alpha * 0.3 },
                duration: Phaser.Math.Between(1500, 3000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    createTitle(width) {
        const title = this.lang ? this.lang.t('settings_title') : 'PARAMÈTRES';
        
        // Créer d'abord le texte pour mesurer sa largeur
        const titleText = this.add.text(width / 2, 82, title, {
            fontSize: '26px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Calculer l'échelle du cadre basée sur la largeur du texte
        const textWidth = titleText.width;
        const minScale = 0.30;
        const maxScale = 0.50;
        const baseWidth = 400;
        const frameScale = Math.min(maxScale, Math.max(minScale, (textWidth + 80) / baseWidth * 0.38));
        
        // Cadre titre doré adaptatif
        const titleFrame = this.add.image(width / 2, 85, 'frame_pseudo_new');
        titleFrame.setScale(frameScale);
        titleFrame.setDepth(0);
        titleText.setDepth(1);
    }

    createMusicSection(width) {
        const label = this.lang ? this.lang.t('settings_music_volume') : '🎵 Volume Musique';
        
        // Cadre à GAUCHE
        const frameX = width / 2 - 230;
        const frameY = 320;
        const frame = this.add.image(frameX, frameY, 'frame_question');
        frame.setScale(0.32);
        
        // Label centré dans le cadre avec stroke - remonté
        this.add.text(frameX, frameY - 50, label, {
            fontSize: '15px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.createVolumeSlider(frameX, frameY - 5, 'music', this.musicVolume);
        this.createToggle(frameX, frameY + 45, 'music', this.musicEnabled);
    }

    createSFXSection(width) {
        const label = this.lang ? this.lang.t('settings_sfx_volume') : '🔊 Volume Effets Sonores';
        
        // Cadre à DROITE
        const frameX = width / 2 + 230;
        const frameY = 320;
        const frame = this.add.image(frameX, frameY, 'frame_question');
        frame.setScale(0.32);
        
        // Label centré dans le cadre avec stroke - remonté
        this.add.text(frameX, frameY - 50, label, {
            fontSize: '15px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.createVolumeSlider(frameX, frameY + 10, 'sfx', this.sfxVolume);
    }

    createLanguageSection(width) {
        const flagY = 480;
        const currentLang = this.lang ? this.lang.getLanguage() : 'fr';
        
        // Les 3 drapeaux - plus grands et espacés
        this.createLanguageFlag(width / 2 - 220, flagY, 'flag_fr_big', 'fr', currentLang);
        this.createLanguageFlag(width / 2, flagY, 'flag_en_big', 'en', currentLang);
        this.createLanguageFlag(width / 2 + 220, flagY, 'flag_de_big', 'de', currentLang);
    }

    createLanguageFlag(x, y, imageKey, lang, currentLang) {
        const flag = this.add.image(x, y, imageKey);
        flag.setScale(0.45);
        flag.setInteractive({ useHandCursor: true });
        
        // Si c'est la langue actuelle, ajouter un contour doré
        if (lang === currentLang) {
            flag.setTint(0xFFFFFF);
            const glow = this.add.circle(x, y, 70, 0xFFD700, 0.3);
            glow.setDepth(-1);
        } else {
            flag.setAlpha(0.7);
        }

        // Effet hover
        flag.on('pointerover', () => {
            flag.setScale(0.52);
            flag.setAlpha(1);
        });

        flag.on('pointerout', () => {
            flag.setScale(0.45);
            if (lang !== currentLang) {
                flag.setAlpha(0.7);
            }
        });

        // Sélection de la langue
        flag.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.changeLanguage(lang);
        });
    }

    changeLanguage(lang) {
        // Sauvegarder la nouvelle langue
        localStorage.setItem('timeguess_language', lang);
        
        // Appliquer la nouvelle langue
        if (this.game.lang) {
            this.game.lang.setLanguage(lang);
        }
        
        // Recharger la scène pour appliquer les changements
        this.scene.restart();
    }

    createVolumeSlider(x, y, type, initialValue) {
        const sliderWidth = 180;
        const sliderHeight = 10;

        // Fond du slider avec style amélioré
        const bgBar = this.add.graphics();
        bgBar.fillStyle(0x2a1810, 1);
        bgBar.fillRoundedRect(x - sliderWidth / 2, y - sliderHeight / 2, sliderWidth, sliderHeight, 5);
        bgBar.lineStyle(2, 0x5D4E37, 1);
        bgBar.strokeRoundedRect(x - sliderWidth / 2, y - sliderHeight / 2, sliderWidth, sliderHeight, 5);

        // Barre de progression
        const fillBar = this.add.graphics();
        this.updateSliderFill(fillBar, x, y, sliderWidth, sliderHeight, initialValue);

        // Curseur avec glow doré
        const knobGlow = this.add.circle(x - sliderWidth / 2 + (initialValue * sliderWidth), y, 14, 0xFFD700, 0.4);
        const knob = this.add.circle(x - sliderWidth / 2 + (initialValue * sliderWidth), y, 10, 0xFFFFFF);
        knob.setStrokeStyle(3, 0xFFD700);
        knob.setInteractive({ draggable: true, useHandCursor: true });

        // Texte pourcentage
        const percentText = this.add.text(x + sliderWidth / 2 + 30, y, Math.round(initialValue * 100) + '%', {
            fontSize: '14px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        knob.on('drag', (pointer, dragX) => {
            const minX = x - sliderWidth / 2;
            const maxX = x + sliderWidth / 2;
            const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
            knob.x = clampedX;
            knobGlow.x = clampedX;

            const value = (clampedX - minX) / sliderWidth;
            percentText.setText(Math.round(value * 100) + '%');
            this.updateSliderFill(fillBar, x, y, sliderWidth, sliderHeight, value);

            if (type === 'music') {
                this.musicVolume = value;
            } else {
                this.sfxVolume = value;
            }
        });

        knob.on('pointerover', () => {
            knob.setScale(1.2);
            knobGlow.setScale(1.3);
        });
        knob.on('pointerout', () => {
            knob.setScale(1);
            knobGlow.setScale(1);
        });
    }

    updateSliderFill(graphics, x, y, width, height, value) {
        graphics.clear();
        const fillWidth = value * width;
        if (fillWidth > 0) {
            graphics.fillGradientStyle(0xFFD700, 0xFFD700, 0xFFA500, 0xFFA500, 1);
            graphics.fillRoundedRect(x - width / 2, y - height / 2, fillWidth, height, 5);
        }
    }

    createToggle(x, y, type, initialValue) {
        const toggleWidth = 50;
        const toggleHeight = 26;

        const bg = this.add.graphics();
        const knob = this.add.circle(0, y, 9, 0xFFFFFF);
        knob.setStrokeStyle(2, 0x5D4E37);
        
        const updateToggle = (enabled) => {
            bg.clear();
            bg.fillStyle(enabled ? 0xFFD700 : 0x3a2a1a, 1);
            bg.fillRoundedRect(x - toggleWidth / 2, y - toggleHeight / 2, toggleWidth, toggleHeight, 13);
            bg.lineStyle(2, enabled ? 0xFFA500 : 0x5D4E37, 1);
            bg.strokeRoundedRect(x - toggleWidth / 2, y - toggleHeight / 2, toggleWidth, toggleHeight, 13);
            knob.x = enabled ? x + toggleWidth / 2 - 13 : x - toggleWidth / 2 + 13;
        };

        updateToggle(initialValue);

        const hitArea = this.add.rectangle(x, y, toggleWidth, toggleHeight, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });

        const onLabel = this.add.text(x + toggleWidth / 2 + 15, y, initialValue ? 'ON' : 'OFF', {
            fontSize: '14px',
            fontFamily: '"Arial Black", sans-serif',
            color: initialValue ? '#FFD700' : '#666666',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0.5);

        hitArea.on('pointerdown', () => {
            this.musicEnabled = !this.musicEnabled;
            updateToggle(this.musicEnabled);
            onLabel.setText(this.musicEnabled ? 'ON' : 'OFF');
            onLabel.setColor(this.musicEnabled ? '#FFD700' : '#666666');
        });
    }

    createButtons(width, height) {
        // Boutons côte à côte - bien remontés
        const btnY = height - 150;
        
        // Bouton Appliquer - à gauche
        this.createValidateButton(width / 2 - 160, btnY, 
            this.lang ? this.lang.t('settings_apply') : '✓ APPLIQUER',
            () => this.applySettings());
        
        // Bouton Reset Game Stats - à droite avec teinte rouge
        this.createValidateButton(width / 2 + 160, btnY,
            '🗑️ RESET GAME',
            () => this.confirmReset(), 0xFF6666);
        
        // Bouton Retour (image)
        const btnBack = this.add.image(100, 50, 'btn_back_new');
        btnBack.setScale(0.22);
        btnBack.setInteractive({ useHandCursor: true });
        
        btnBack.on('pointerover', () => btnBack.setScale(0.25));
        btnBack.on('pointerout', () => btnBack.setScale(0.22));
        btnBack.on('pointerdown', () => {
            btnBack.setScale(0.20);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.goBack();
        });
    }

    createValidateButton(x, y, text, callback, tint = null) {
        const btn = this.add.container(x, y);
        
        // Image du bouton en bois
        const btnImage = this.add.image(0, 0, 'btn_validate');
        btnImage.setScale(0.40);
        if (tint) btnImage.setTint(tint);
        btn.add(btnImage);
        
        // Texte centré sur le bouton
        const label = this.add.text(0, -2, text, {
            fontSize: '16px', 
            fontFamily: '"Arial Black", sans-serif', 
            color: '#FFFFFF', stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        btn.add(label);
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, 260, 90, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        btn.add(hitArea);
        
        hitArea.on('pointerover', () => btn.setScale(1.08));
        hitArea.on('pointerout', () => btn.setScale(1));
        hitArea.on('pointerdown', () => {
            btn.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
        });
        hitArea.on('pointerup', () => {
            btn.setScale(1);
            callback();
        });
    }

    // Old createButton kept for compatibility but unused
    createButton(x, y, text, color, callback) {
        this.createValidateButton(x, y, text, callback, color === 0xFF6B6B ? 0xFF6666 : null);
    }

    applySettings() {
        this.saveSettings({
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            musicEnabled: this.musicEnabled
        });

        if (this.game.soundManager) {
            this.game.soundManager.setMusicVolume(this.musicVolume);
            if (!this.musicEnabled) {
                this.game.soundManager.stopMusic();
            } else {
                this.game.soundManager.playBackgroundMusic();
            }
        }
    }

    confirmReset() {
        const msg = this.lang ? this.lang.t('settings_reset_confirm') : 'Réinitialiser toutes les statistiques ?';
        if (confirm(msg)) {
            if (this.game.progression) {
                this.game.progression.resetProgress();
            }
            localStorage.removeItem('timeguess_stats');
        }
    }

    goBack() {
        this.cameras.main.fadeOut(250);
        this.time.delayedCall(250, () => this.scene.start('MenuScene'));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('timeguess_settings');
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return { musicVolume: 0.5, sfxVolume: 1, musicEnabled: true };
    }

    saveSettings(settings) {
        localStorage.setItem('timeguess_settings', JSON.stringify(settings));
    }
}

window.SettingsScene = SettingsScene;
