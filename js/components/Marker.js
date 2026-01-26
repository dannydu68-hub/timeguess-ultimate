/**
 * Marker.js
 * Marqueur en forme de TRAIT VERTICAL avec affichage année en temps réel
 */

class Marker {
    constructor(scene, index, color, timeline, min, max) {
        this.scene = scene;
        this.index = index;
        this.color = color;
        this.timeline = timeline;
        
        this._minYear = min;
        this._maxYear = max;
        
        this.container = null;
        this.isDragging = false;
        this.position = 0.5;
        this.isLocked = false;
        this.hasBeenMoved = true;
        this.yearLabel = null;
    }

    create(x, y) {
        this.container = this.scene.add.container(x, y);

        // Image du curseur - utilise le curseur choisi par le joueur
        const cursorImage = this.scene.game.progression?.getCurrentCursorImage() || 'cursor';
        this.cursorImage = this.scene.add.image(0, 15, cursorImage);
        this.cursorImage.setScale(0.28);
        this.container.add(this.cursorImage);

        // === LABEL ANNÉE EN DESSOUS DU CURSEUR - bien espacé ===
        this.yearBg = this.scene.add.graphics();
        this.yearBg.fillStyle(0x000000, 0.9);
        this.yearBg.fillRoundedRect(-35, 75, 70, 32, 10);
        this.container.add(this.yearBg);
        
        this.yearLabel = this.scene.add.text(0, 91, this.getValue().toString(), {
            fontSize: '18px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700'
        }).setOrigin(0.5);
        this.container.add(this.yearLabel);

        // Zone interactive
        this.hitArea = this.scene.add.rectangle(0, 45, 60, 150, 0xFFFFFF, 0);
        this.hitArea.setInteractive({ draggable: true, useHandCursor: true });
        this.container.add(this.hitArea);

        this.setupDrag();
        
        // Animation d'entrée
        this.container.setScale(0.5, 0);
        this.scene.tweens.add({
            targets: this.container,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
    }

    setupDrag() {
        this.hitArea.on('dragstart', () => {
            if (this.isLocked) return;
            this.isDragging = true;
            
            // Seul le curseur grandit
            this.scene.tweens.add({
                targets: this.cursorImage,
                scaleX: 0.32,
                scaleY: 0.32,
                duration: 100
            });
        });

        this.hitArea.on('drag', (pointer) => {
            if (this.isLocked) return;

            const timelineX = this.timeline.getX();
            const timelineWidth = this.timeline.getWidth();
            const minX = timelineX;
            const maxX = timelineX + timelineWidth;

            let newX = Phaser.Math.Clamp(pointer.x, minX, maxX);
            this.container.x = newX;
            this.position = (newX - timelineX) / timelineWidth;
            
            // Mettre à jour l'affichage de l'année
            this.updateYearLabel();
        });

        this.hitArea.on('dragend', () => {
            if (this.isLocked) return;
            this.isDragging = false;
            this.hasBeenMoved = true;
            
            // Seul le curseur rétrécit
            this.scene.tweens.add({
                targets: this.cursorImage,
                scaleX: 0.28,
                scaleY: 0.28,
                duration: 100
            });
        });
    }

    updateYearLabel() {
        if (this.yearLabel) {
            const year = this.getValue();
            this.yearLabel.setText(year.toString());
        }
    }

    getValue() {
        let minYear = this._minYear;
        let maxYear = this._maxYear;
        
        if (minYear === undefined || maxYear === undefined) {
            if (this.scene && this.scene.currentQuestion && this.scene.currentQuestion.timeline) {
                minYear = this.scene.currentQuestion.timeline.min;
                maxYear = this.scene.currentQuestion.timeline.max;
            }
        }
        
        if (minYear === undefined || maxYear === undefined) {
            if (this.timeline && this.timeline.startYear !== undefined) {
                minYear = this.timeline.startYear;
                maxYear = this.timeline.endYear;
            }
        }
        
        if (minYear === undefined || maxYear === undefined) {
            return NaN;
        }
        
        const range = maxYear - minYear;
        return Math.round(minYear + (this.position * range));
    }

    setPosition(normalizedPosition) {
        this.position = Phaser.Math.Clamp(normalizedPosition, 0, 1);
        const timelineX = this.timeline.getX();
        const timelineWidth = this.timeline.getWidth();
        this.container.x = timelineX + (this.position * timelineWidth);
        this.updateYearLabel();
    }

    lock() {
        this.isLocked = true;
        if (this.hitArea) {
            this.hitArea.disableInteractive();
        }
        if (this.cursorImage) {
            this.cursorImage.setTint(0x888888);
        }
    }

    unlock() {
        this.isLocked = false;
        if (this.hitArea) {
            this.hitArea.setInteractive({ draggable: true, useHandCursor: true });
        }
        if (this.cursorImage) {
            this.cursorImage.clearTint();
        }
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    }

    getContainer() {
        return this.container;
    }
}

window.Marker = Marker;
