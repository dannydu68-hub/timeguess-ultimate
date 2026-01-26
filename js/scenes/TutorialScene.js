/**
 * TutorialScene.js
 * Tutoriel interactif pour les nouveaux joueurs
 */

class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
        this.currentStep = 0;
        this.tutorialSteps = [];
    }

    init(data) {
        this.playerName = data.playerName || 'Joueur';
        this.currentStep = 0;
    }

    preload() {
        // Les assets sont déjà chargés par MenuScene
        if (!this.textures.exists('background')) {
            this.load.image('background', 'assets/images/background.png?v=107');
        }
        if (!this.textures.exists('timeline')) {
            this.load.image('timeline', 'assets/images/timeline.png?v=107');
        }
        if (!this.textures.exists('cursor')) {
            this.load.image('cursor', 'assets/images/cursor.png?v=107');
        }
        if (!this.textures.exists('btn_validate')) {
            this.load.image('btn_validate', 'assets/images/btn_validate.png?v=107');
        }
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.lang = this.game.lang;
        
        // Traductions du tutoriel
        this.translations = this.getTranslations();
        
        this.createBackground(width, height);
        this.createTutorialSteps();
        this.showStep(0);
        
        this.cameras.main.fadeIn(300);
    }

    getTranslations() {
        const lang = this.lang?.getLanguage() || 'fr';
        
        const translations = {
            fr: {
                title: '📖 TUTORIEL',
                step1_title: 'Bienvenue dans TIMEGUESS !',
                step1_text: 'Dans ce jeu, tu dois placer des événements historiques sur une frise chronologique.',
                step2_title: 'La Timeline',
                step2_text: 'Voici la frise chronologique. Elle va de 1900 à 2025.',
                step3_title: 'La Question',
                step3_text: 'Un événement apparaît en haut. Tu dois deviner QUAND il s\'est produit.',
                step4_title: 'Placer ta réponse',
                step4_text: 'Clique ou glisse sur la timeline pour positionner le curseur à l\'année que tu penses correcte.',
                step5_title: 'Valider',
                step5_text: 'Appuie sur le bouton VALIDER pour confirmer ta réponse.',
                step6_title: 'Tolérance',
                step6_text: 'Selon la difficulté, tu as une marge d\'erreur :\n• Facile: ±5 ans\n• Normal: ±2 ans\n• Difficile: ±1 an\n• Expert: Année exacte',
                step7_title: 'Score & Combo',
                step7_text: 'Chaque bonne réponse te donne des points. Enchaîne les bonnes réponses pour augmenter ton combo et marquer plus de points !',
                step8_title: 'Jokers',
                step8_text: 'Tu disposes de 3 jokers :\n• 50/50 : Réduit la plage\n• +5s : Ajoute du temps\n• Passer : Change de question',
                step9_title: 'Prêt à jouer ?',
                step9_text: 'Tu as compris les bases ! Bonne chance et amuse-toi bien ! 🎮',
                next: 'SUIVANT →',
                prev: '← PRÉCÉDENT',
                skip: 'PASSER',
                start: '🎮 COMMENCER !',
                back: '← MENU'
            },
            en: {
                title: '📖 TUTORIAL',
                step1_title: 'Welcome to TIMEGUESS!',
                step1_text: 'In this game, you must place historical events on a timeline.',
                step2_title: 'The Timeline',
                step2_text: 'Here is the timeline. It goes from 1900 to 2025.',
                step3_title: 'The Question',
                step3_text: 'An event appears at the top. You must guess WHEN it happened.',
                step4_title: 'Place your answer',
                step4_text: 'Click or drag on the timeline to position the cursor at the year you think is correct.',
                step5_title: 'Validate',
                step5_text: 'Press the VALIDATE button to confirm your answer.',
                step6_title: 'Tolerance',
                step6_text: 'Depending on difficulty, you have an error margin:\n• Easy: ±5 years\n• Normal: ±2 years\n• Hard: ±1 year\n• Expert: Exact year',
                step7_title: 'Score & Combo',
                step7_text: 'Each correct answer gives you points. Chain correct answers to increase your combo and score more points!',
                step8_title: 'Jokers',
                step8_text: 'You have 3 jokers:\n• 50/50: Reduces range\n• +5s: Adds time\n• Skip: Changes question',
                step9_title: 'Ready to play?',
                step9_text: 'You understand the basics! Good luck and have fun! 🎮',
                next: 'NEXT →',
                prev: '← PREVIOUS',
                skip: 'SKIP',
                start: '🎮 START!',
                back: '← MENU'
            },
            de: {
                title: '📖 TUTORIAL',
                step1_title: 'Willkommen bei TIMEGUESS!',
                step1_text: 'In diesem Spiel musst du historische Ereignisse auf einer Zeitleiste platzieren.',
                step2_title: 'Die Zeitleiste',
                step2_text: 'Hier ist die Zeitleiste. Sie geht von 1900 bis 2025.',
                step3_title: 'Die Frage',
                step3_text: 'Ein Ereignis erscheint oben. Du musst erraten, WANN es passiert ist.',
                step4_title: 'Platziere deine Antwort',
                step4_text: 'Klicke oder ziehe auf der Zeitleiste, um den Cursor auf das Jahr zu setzen, das du für richtig hältst.',
                step5_title: 'Bestätigen',
                step5_text: 'Drücke den BESTÄTIGEN Button, um deine Antwort zu bestätigen.',
                step6_title: 'Toleranz',
                step6_text: 'Je nach Schwierigkeit hast du eine Fehlertoleranz:\n• Leicht: ±5 Jahre\n• Normal: ±2 Jahre\n• Schwer: ±1 Jahr\n• Experte: Exaktes Jahr',
                step7_title: 'Punkte & Combo',
                step7_text: 'Jede richtige Antwort gibt dir Punkte. Verkette richtige Antworten, um deinen Combo zu erhöhen und mehr Punkte zu erzielen!',
                step8_title: 'Joker',
                step8_text: 'Du hast 3 Joker:\n• 50/50: Reduziert den Bereich\n• +5s: Fügt Zeit hinzu\n• Überspringen: Wechselt die Frage',
                step9_title: 'Bereit zu spielen?',
                step9_text: 'Du verstehst die Grundlagen! Viel Glück und viel Spaß! 🎮',
                next: 'WEITER →',
                prev: '← ZURÜCK',
                skip: 'ÜBERSPRINGEN',
                start: '🎮 STARTEN!',
                back: '← MENÜ'
            }
        };
        
        return translations[lang] || translations.fr;
    }

    createBackground(width, height) {
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setDisplaySize(width, height);
        
        // Overlay sombre pour le tutoriel
        this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.4);
    }

    createTutorialSteps() {
        const t = this.translations;
        
        this.tutorialSteps = [
            { 
                title: t.step1_title, 
                text: t.step1_text,
                visual: 'welcome'
            },
            { 
                title: t.step2_title, 
                text: t.step2_text,
                visual: 'timeline'
            },
            { 
                title: t.step3_title, 
                text: t.step3_text,
                visual: 'question'
            },
            { 
                title: t.step4_title, 
                text: t.step4_text,
                visual: 'cursor'
            },
            { 
                title: t.step5_title, 
                text: t.step5_text,
                visual: 'validate'
            },
            { 
                title: t.step6_title, 
                text: t.step6_text,
                visual: 'tolerance'
            },
            { 
                title: t.step7_title, 
                text: t.step7_text,
                visual: 'combo'
            },
            { 
                title: t.step8_title, 
                text: t.step8_text,
                visual: 'jokers'
            },
            { 
                title: t.step9_title, 
                text: t.step9_text,
                visual: 'ready'
            }
        ];
    }

    showStep(stepIndex) {
        const { width, height } = this.cameras.main;
        const t = this.translations;
        
        // Nettoyer le contenu précédent
        if (this.stepContainer) {
            this.stepContainer.destroy();
        }
        
        this.stepContainer = this.add.container(0, 0);
        
        const step = this.tutorialSteps[stepIndex];
        
        // === TITRE DU TUTORIEL ===
        this.stepContainer.add(this.add.text(width / 2, 40, t.title, {
            fontSize: '28px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700', stroke: '#000000', strokeThickness: 3,
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5));
        
        // === INDICATEUR D'ÉTAPES ===
        const dotsY = 85;
        for (let i = 0; i < this.tutorialSteps.length; i++) {
            const dotX = width / 2 - (this.tutorialSteps.length - 1) * 15 / 2 + i * 15;
            const dot = this.add.circle(dotX, dotsY, 5, i === stepIndex ? 0xFFD700 : 0x666666);
            this.stepContainer.add(dot);
        }
        
        // === PANNEAU PRINCIPAL ===
        const panelW = 700;
        const panelH = 450;
        const panelX = width / 2;
        const panelY = height / 2 + 20;
        
        // Fond du panneau
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 0.95);
        panel.fillRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 20);
        panel.lineStyle(3, 0x667EEA, 0.8);
        panel.strokeRoundedRect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 20);
        this.stepContainer.add(panel);
        
        // === TITRE DE L'ÉTAPE ===
        this.stepContainer.add(this.add.text(panelX, panelY - panelH / 2 + 50, step.title, {
            fontSize: '26px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#4ECDC4', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
        
        // === ZONE VISUELLE ===
        this.createVisual(step.visual, panelX, panelY - 30, panelW - 60);
        
        // === TEXTE EXPLICATIF ===
        this.stepContainer.add(this.add.text(panelX, panelY + panelH / 2 - 100, step.text, {
            fontSize: '18px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF', stroke: '#000000', strokeThickness: 3,
            align: 'center',
            wordWrap: { width: panelW - 80 },
            lineSpacing: 8
        }).setOrigin(0.5));
        
        // === BOUTONS DE NAVIGATION ===
        const btnY = panelY + panelH / 2 - 30;
        
        // Bouton Précédent
        if (stepIndex > 0) {
            this.createTextButton(panelX - 200, btnY, t.prev, () => {
                this.showStep(stepIndex - 1);
            });
        }
        
        // Bouton Passer / Menu
        if (stepIndex < this.tutorialSteps.length - 1) {
            this.createTextButton(panelX, btnY, t.skip, () => {
                this.goToMenu();
            }, '#888888');
        }
        
        // Bouton Suivant / Commencer
        if (stepIndex < this.tutorialSteps.length - 1) {
            this.createTextButton(panelX + 200, btnY, t.next, () => {
                this.showStep(stepIndex + 1);
            }, '#4ECDC4');
        } else {
            // Dernier écran - bouton Commencer
            this.createTextButton(panelX, btnY, t.start, () => {
                this.startGame();
            }, '#00FF88', true);
        }
        
        // Bouton Retour Menu (en haut à gauche)
        const backBtn = this.add.image(100, 50, 'btn_back_new');
        backBtn.setScale(0.22);
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerover', () => backBtn.setScale(0.25));
        backBtn.on('pointerout', () => backBtn.setScale(0.22));
        backBtn.on('pointerdown', () => {
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.goToMenu();
        });
        this.stepContainer.add(backBtn);
        
        this.currentStep = stepIndex;
    }

    createVisual(type, x, y, maxWidth) {
        const visualY = y - 40;
        
        switch (type) {
            case 'welcome':
                // Logo ou animation de bienvenue
                this.stepContainer.add(this.add.text(x, visualY, '🎮⏱️🏆', {
                    fontSize: '64px'
                }).setOrigin(0.5));
                break;
                
            case 'timeline':
                // Afficher une mini timeline
                this.createMiniTimeline(x, visualY, maxWidth - 100);
                break;
                
            case 'question':
                // Afficher un exemple de question
                const questionBg = this.add.graphics();
                questionBg.fillStyle(0x000000, 0.5);
                questionBg.fillRoundedRect(x - 250, visualY - 40, 500, 80, 10);
                this.stepContainer.add(questionBg);
                
                const lang = this.lang?.getLanguage() || 'fr';
                const exampleQ = {
                    fr: 'Sortie du premier iPhone',
                    en: 'First iPhone release',
                    de: 'Erstes iPhone veröffentlicht'
                };
                this.stepContainer.add(this.add.text(x, visualY, '❓ ' + (exampleQ[lang] || exampleQ.fr), {
                    fontSize: '22px',
                    fontFamily: '"Arial Black", sans-serif',
                    color: '#FFD700', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5));
                break;
                
            case 'cursor':
                // Afficher la timeline avec un curseur animé
                this.createMiniTimeline(x, visualY, maxWidth - 100);
                this.createAnimatedCursor(x, visualY + 25);
                break;
                
            case 'validate':
                // Afficher le bouton valider
                if (this.textures.exists('btn_validate')) {
                    const validateBtn = this.add.image(x, visualY, 'btn_validate');
                    validateBtn.setScale(0.4);
                    this.stepContainer.add(validateBtn);
                    
                    // Animation de pulsation
                    this.tweens.add({
                        targets: validateBtn,
                        scale: 0.45,
                        duration: 500,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                } else {
                    this.stepContainer.add(this.add.text(x, visualY, '✓ VALIDER', {
                        fontSize: '32px',
                        fontFamily: '"Arial Black", sans-serif',
                        color: '#4ECDC4', stroke: '#000000', strokeThickness: 3,
                        backgroundColor: '#1a1a2e',
                        padding: { x: 30, y: 15 }
                    }).setOrigin(0.5));
                }
                break;
                
            case 'tolerance':
                // Afficher les zones de tolérance
                this.createToleranceVisual(x, visualY);
                break;
                
            case 'combo':
                // Afficher un exemple de combo
                this.stepContainer.add(this.add.text(x, visualY - 20, '⚡ COMBO x5', {
                    fontSize: '36px',
                    fontFamily: '"Arial Black", sans-serif',
                    color: '#FFD700', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5));
                
                this.stepContainer.add(this.add.text(x, visualY + 25, '+250 pts', {
                    fontSize: '24px',
                    fontFamily: '"Arial Black", sans-serif',
                    color: '#00FF88', stroke: '#000000', strokeThickness: 3
                }).setOrigin(0.5));
                break;
                
            case 'jokers':
                // Afficher les 3 jokers
                const jokers = ['50/50', '+5s', '⏭️'];
                const colors = ['#FF6B6B', '#4ECDC4', '#FFD700'];
                jokers.forEach((joker, i) => {
                    const jx = x - 120 + i * 120;
                    
                    const jokerBg = this.add.graphics();
                    jokerBg.fillStyle(0x000000, 0.6);
                    jokerBg.fillCircle(jx, visualY, 40);
                    jokerBg.lineStyle(3, Phaser.Display.Color.HexStringToColor(colors[i]).color, 1);
                    jokerBg.strokeCircle(jx, visualY, 40);
                    this.stepContainer.add(jokerBg);
                    
                    this.stepContainer.add(this.add.text(jx, visualY, joker, {
                        fontSize: i === 2 ? '28px' : '20px',
                        fontFamily: '"Arial Black", sans-serif',
                        color: colors[i]
                    }).setOrigin(0.5));
                });
                break;
                
            case 'ready':
                // Animation finale
                this.stepContainer.add(this.add.text(x, visualY, '🚀', {
                    fontSize: '80px'
                }).setOrigin(0.5));
                
                // Animation de rebond
                const rocket = this.stepContainer.list[this.stepContainer.list.length - 1];
                this.tweens.add({
                    targets: rocket,
                    y: visualY - 20,
                    duration: 600,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                break;
        }
    }

    createMiniTimeline(x, y, width) {
        const startX = x - width / 2;
        const endX = x + width / 2;
        
        // Ligne principale
        const line = this.add.graphics();
        line.lineStyle(4, 0x667EEA, 1);
        line.beginPath();
        line.moveTo(startX, y);
        line.lineTo(endX, y);
        line.strokePath();
        this.stepContainer.add(line);
        
        // Marqueurs d'années
        const years = [1900, 1950, 2000, 2025];
        years.forEach(year => {
            const pos = startX + ((year - 1900) / 125) * width;
            
            // Trait vertical
            const tick = this.add.graphics();
            tick.lineStyle(2, 0xFFFFFF, 0.8);
            tick.beginPath();
            tick.moveTo(pos, y - 10);
            tick.lineTo(pos, y + 10);
            tick.strokePath();
            this.stepContainer.add(tick);
            
            // Année
            this.stepContainer.add(this.add.text(pos, y + 22, year.toString(), {
                fontSize: '12px',
                fontFamily: '"Arial Black", sans-serif',
                color: '#CCCCCC', stroke: '#000000', strokeThickness: 2
            }).setOrigin(0.5));
        });
    }

    createAnimatedCursor(x, y) {
        // Curseur qui bouge sur la timeline
        const cursor = this.add.image(x, y, 'cursor');
        cursor.setScale(0.15);
        this.stepContainer.add(cursor);
        
        // Animation de gauche à droite
        this.tweens.add({
            targets: cursor,
            x: { from: x - 150, to: x + 150 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Indicateur "clique ici"
        const pointer = this.add.text(x, y + 50, '👆', {
            fontSize: '32px'
        }).setOrigin(0.5);
        this.stepContainer.add(pointer);
        
        this.tweens.add({
            targets: pointer,
            y: y + 55,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createToleranceVisual(x, y) {
        const barWidth = 300;
        const barHeight = 20;
        
        // Zone de tolérance (vert)
        const green = this.add.rectangle(x, y, barWidth * 0.3, barHeight, 0x00FF88, 0.8);
        this.stepContainer.add(green);
        
        // Zone acceptable (jaune)
        const yellow1 = this.add.rectangle(x - barWidth * 0.3, y, barWidth * 0.2, barHeight, 0xFFD700, 0.6);
        const yellow2 = this.add.rectangle(x + barWidth * 0.3, y, barWidth * 0.2, barHeight, 0xFFD700, 0.6);
        this.stepContainer.add(yellow1);
        this.stepContainer.add(yellow2);
        
        // Zone hors tolérance (rouge)
        const red1 = this.add.rectangle(x - barWidth * 0.4, y, barWidth * 0.1, barHeight, 0xFF6B6B, 0.5);
        const red2 = this.add.rectangle(x + barWidth * 0.4, y, barWidth * 0.1, barHeight, 0xFF6B6B, 0.5);
        this.stepContainer.add(red1);
        this.stepContainer.add(red2);
        
        // Légende
        const lang = this.lang?.getLanguage() || 'fr';
        const legendText = {
            fr: '✓ Zone correcte',
            en: '✓ Correct zone',
            de: '✓ Richtige Zone'
        };
        this.stepContainer.add(this.add.text(x, y + 30, legendText[lang] || legendText.fr, {
            fontSize: '14px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#00FF88', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5));
    }

    createTextButton(x, y, text, callback, color = '#FFD700', large = false) {
        const btn = this.add.container(x, y);
        
        // Image du bouton en bois
        const btnImage = this.add.image(0, 0, 'btn_validate');
        btnImage.setScale(large ? 0.40 : 0.30);
        btn.add(btnImage);
        
        // Texte centré sur le bouton
        const label = this.add.text(0, -2, text, {
            fontSize: large ? '18px' : '14px', 
            fontFamily: '"Arial Black", sans-serif', 
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        btn.add(label);
        
        // Zone interactive
        const hitArea = this.add.rectangle(0, 0, large ? 250 : 180, large ? 80 : 60, 0xFFFFFF, 0);
        hitArea.setInteractive({ useHandCursor: true });
        btn.add(hitArea);
        
        hitArea.on('pointerover', () => btn.setScale(1.1));
        hitArea.on('pointerout', () => btn.setScale(1));
        hitArea.on('pointerdown', () => {
            btn.setScale(0.95);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            callback();
        });
        
        this.stepContainer.add(btn);
    }

    goToMenu() {
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('MenuScene');
        });
    }

    startGame() {
        // Marquer le tutoriel comme vu
        try {
            localStorage.setItem('timeguess_tutorial_seen', 'true');
        } catch (e) {}
        
        this.cameras.main.fadeOut(300);
        this.time.delayedCall(300, () => {
            this.scene.start('CategoryScene', { playerName: this.playerName });
        });
    }
}

window.TutorialScene = TutorialScene;
