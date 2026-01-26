/**
 * Timeline.js
 * Composant Timeline avec 3 images séparées:
 * - timeline.png: barre centrale dorée (zone de jeu)
 * - cadre_date_gauche.png: cadre pour date min
 * - cadre_date_droite.png: cadre pour date max
 */

class Timeline {
    constructor(scene, question) {
        this.scene = scene;
        this.question = question;
        this.container = null;
        
        this.startYear = question.timeline.min;
        this.endYear = question.timeline.max;
    }

    create() {
        const x = CONFIG.TIMELINE.X;
        const y = CONFIG.TIMELINE.Y;
        const width = CONFIG.TIMELINE.WIDTH;

        this.container = this.scene.add.container(x, y);

        // === TAILLES ===
        const cadreScale = 0.28; // Cadres bois plus grands
        
        // === CADRE DATE GAUCHE ===
        const cadreGauche = this.scene.add.image(0, 0, 'cadre_date_gauche');
        cadreGauche.setScale(cadreScale);
        cadreGauche.setOrigin(0, 0.5);
        this.container.add(cadreGauche);
        
        const cadreGaucheWidth = cadreGauche.displayWidth;
        
        // Texte date min - centré dans le cadre bois
        const minText = this.scene.add.text(cadreGaucheWidth / 2, 0, this.question.timeline.min.toString(), {
            fontSize: '18px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#5D4E37',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.container.add(minText);
        
        // === CADRE DATE DROITE ===
        const cadreDroite = this.scene.add.image(width, 0, 'cadre_date_droite');
        cadreDroite.setScale(cadreScale);
        cadreDroite.setOrigin(1, 0.5);
        this.container.add(cadreDroite);
        
        const cadreDroiteWidth = cadreDroite.displayWidth;
        
        // Texte date max - centré dans le cadre bois
        const maxText = this.scene.add.text(width - cadreDroiteWidth / 2, 0, this.question.timeline.max.toString(), {
            fontSize: '18px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF',
            stroke: '#5D4E37',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.container.add(maxText);
        
        // === TIMELINE CENTRALE ===
        const gap = 15; // Plus d'espace entre les cadres et la timeline
        const timelineStartX = cadreGaucheWidth + gap;
        const timelineEndX = width - cadreDroiteWidth - gap;
        const timelineWidth = timelineEndX - timelineStartX;
        const timelineCenterX = timelineStartX + timelineWidth / 2;
        
        const timelineImage = this.scene.add.image(timelineCenterX, 0, 'timeline');
        // Scale uniforme pour garder les proportions
        const baseScale = 0.55;
        const scaleX = (timelineWidth / timelineImage.width) * 1.05;
        timelineImage.setScale(scaleX, baseScale);
        this.container.add(timelineImage);
        
        // Zone jouable
        this.playableStartX = timelineStartX + 15;
        this.playableEndX = timelineEndX - 15;
        this.playableWidth = this.playableEndX - this.playableStartX;

        // Animation d'entrée
        this.container.setAlpha(0);
        this.container.setY(y + 30);
        this.scene.tweens.add({
            targets: this.container,
            alpha: 1,
            y: y,
            duration: 400,
            ease: 'Power2.easeOut'
        });
    }

    getX() {
        // Début de la zone jouable
        return this.container.x + this.playableStartX;
    }

    getY() {
        return this.container.y;
    }

    getWidth() {
        // Largeur de la zone jouable
        return this.playableWidth;
    }
    
    getRealX() {
        return this.container.x;
    }
    
    getRealWidth() {
        return CONFIG.TIMELINE.WIDTH;
    }

    revealCorrectZone(correctValue, tolerance) {
        const width = this.getWidth();
        const min = this.question.timeline.min;
        const max = this.question.timeline.max;
        const range = max - min;
        
        const correctPos = (correctValue - min) / range;
        const toleranceWidth = (tolerance / range) * width;
        
        const zoneX = this.playableStartX + (correctPos * width);
        const zoneWidth = Math.max(toleranceWidth * 2, 30);
        
        // Zone verte
        const zone = this.scene.add.rectangle(zoneX, 0, zoneWidth, 40, 0x00D9A5, 0);
        zone.setStrokeStyle(3, 0x00D9A5, 0);
        this.container.add(zone);
        
        this.scene.tweens.add({
            targets: zone,
            fillAlpha: 0.4,
            strokeAlpha: 1,
            duration: 300,
            ease: 'Power2'
        });

        // Flèche
        const arrow = this.scene.add.text(zoneX, -30, '▼', {
            fontSize: '24px',
            color: '#00D9A5',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(arrow);
        
        this.scene.tweens.add({
            targets: arrow,
            alpha: 1,
            y: -22,
            duration: 300,
            ease: 'Back.easeOut'
        });

        // Label année correcte
        const labelBg = this.scene.add.graphics();
        labelBg.fillStyle(0x00D9A5, 0.9);
        labelBg.fillRoundedRect(zoneX - 35, 28, 70, 28, 8);
        labelBg.setAlpha(0);
        this.container.add(labelBg);

        const label = this.scene.add.text(zoneX, 42, correctValue.toString(), {
            fontSize: '16px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFFFFF'
        }).setOrigin(0.5).setAlpha(0);
        this.container.add(label);

        this.scene.tweens.add({
            targets: [labelBg, label],
            alpha: 1,
            duration: 300,
            delay: 150,
            ease: 'Power2'
        });
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }
}

window.Timeline = Timeline;
