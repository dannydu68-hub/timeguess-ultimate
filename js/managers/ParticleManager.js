/**
 * ParticleManager.js
 * Gestionnaire d'effets de particules
 */

class ParticleManager {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Explosion de particules dorées (correct)
     */
    burstGold(x, y) {
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = Phaser.Math.Between(100, 300);
            const particle = this.scene.add.circle(x, y, Phaser.Math.Between(3, 6), 0xFFD700);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                duration: 800,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    /**
     * Explosion de particules rouges (faux)
     */
    burstRed(x, y) {
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = Phaser.Math.Between(50, 150);
            const particle = this.scene.add.circle(x, y, Phaser.Math.Between(2, 5), 0xFF0000);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    /**
     * Effet de combo (flammes)
     */
    comboFlames(x, y, combo) {
        const colors = [0xFF6600, 0xFF9900, 0xFFCC00];
        
        for (let i = 0; i < combo * 5; i++) {
            const offsetX = Phaser.Math.Between(-30, 30);
            const particle = this.scene.add.circle(
                x + offsetX, 
                y + 30, 
                Phaser.Math.Between(4, 8), 
                Phaser.Utils.Array.GetRandom(colors)
            );
            
            this.scene.tweens.add({
                targets: particle,
                y: y - 80,
                scale: 0,
                alpha: 0,
                duration: Phaser.Math.Between(600, 1000),
                delay: i * 20,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    /**
     * Pluie de confettis (victoire)
     */
    confetti() {
        const { width, height } = this.scene.cameras.main;
        const colors = [0xFF6B6B, 0x4ECDC4, 0xFFD700, 0xBB8FCE, 0xFF6B9D];
        
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-100, -20);
            const size = Phaser.Math.Between(5, 12);
            const color = Phaser.Utils.Array.GetRandom(colors);
            
            const confetti = this.scene.add.rectangle(x, y, size, size, color);
            confetti.setRotation(Phaser.Math.FloatBetween(0, Math.PI * 2));
            
            this.scene.tweens.add({
                targets: confetti,
                y: height + 50,
                rotation: confetti.rotation + Phaser.Math.FloatBetween(2, 6),
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 1000),
                ease: 'Linear',
                onComplete: () => confetti.destroy()
            });
        }
    }

    /**
     * Trail de particules pour le marqueur
     */
    markerTrail(x, y, color) {
        const particle = this.scene.add.circle(x, y, 8, color, 0.6);
        
        this.scene.tweens.add({
            targets: particle,
            scale: 0,
            alpha: 0,
            duration: 400,
            ease: 'Power2',
            onComplete: () => particle.destroy()
        });
    }

    /**
     * Shake de l'écran (erreur)
     */
    screenShake() {
        this.scene.cameras.main.shake(200, 0.01);
    }

    /**
     * Flash de l'écran
     */
    screenFlash(color = 0xFFFFFF) {
        this.scene.cameras.main.flash(150, 
            Phaser.Display.Color.IntegerToColor(color).red,
            Phaser.Display.Color.IntegerToColor(color).green,
            Phaser.Display.Color.IntegerToColor(color).blue
        );
    }
}

window.ParticleManager = ParticleManager;
