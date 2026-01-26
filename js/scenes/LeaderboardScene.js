/**
 * LeaderboardScene.js
 * Scène avec onglets: Boutique, Thèmes, Avatars
 */

class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.currentTab = 'shop';
    }

    preload() {
        if (!this.textures.exists('background_night')) {
            this.load.image('background_night', 'assets/images/background_night.png?v=107');
        }
        if (!this.textures.exists('btn_back_new')) {
            this.load.image('btn_back_new', 'assets/images/btn_back_new.png?v=110');
        }
        if (!this.textures.exists('frame_pseudo_new')) {
            this.load.image('frame_pseudo_new', 'assets/images/frame_pseudo_new.png?v=110');
        }
        if (!this.textures.exists('btn_tab_gold_small')) {
            this.load.image('btn_tab_gold_small', 'assets/images/btn_tab_gold.png?v=110');
        }
        if (!this.textures.exists('cadre_grand')) {
            this.load.image('cadre_grand', 'assets/images/frame_content_gold.png?v=130');
        }
        if (!this.textures.exists('frame_item_square')) {
            this.load.image('frame_item_square', 'assets/images/frame_item_square.png?v=131');
        }
        if (!this.textures.exists('frame_coins')) {
            this.load.image('frame_coins', 'assets/images/frame_coins.png?v=107');
        }
        // Charger tous les curseurs
        if (!this.textures.exists('cursor')) {
            this.load.image('cursor', 'assets/images/cursor.png?v=107');
        }
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`cursor_${i}`)) {
                this.load.image(`cursor_${i}`, `assets/images/cursor_${i}.png`);
            }
        }
        // Charger tous les avatars
        for (let i = 1; i <= 11; i++) {
            if (!this.textures.exists(`avatar_${i}`)) {
                this.load.image(`avatar_${i}`, `assets/images/avatars/avatar_${i}.png?v=107`);
            }
        }
    }

    create() {
        const { width, height } = this.cameras.main;
        this.progression = this.game.progression || new ProgressionManager();
        this.lang = this.game.lang;
        
        // Marquer tous les items comme vus (retirer le point rouge de notification)
        if (this.progression.markAllItemsAsSeen) {
            this.progression.markAllItemsAsSeen();
        }
        
        this.createBackground(width, height);
        this.createHeader(width);
        this.createTabs(width);
        this.contentContainer = this.add.container(0, 0);
        this.showTabContent(width, height);
        this.createBackButton();
        
        this.cameras.main.fadeIn(300);
    }

    createBackground(width, height) {
        const bg = this.add.image(width / 2, height / 2, 'background_night');
        bg.setDisplaySize(width, height);
    }

    createHeader(width) {
        const lang = this.lang?.getLanguage() || 'fr';
        const titles = { fr: 'PERSONNALISATION', en: 'CUSTOMIZATION', de: 'ANPASSUNG' };
        const title = titles[lang] || titles.fr;
        
        // Créer d'abord le texte pour mesurer sa largeur
        const titleText = this.add.text(width / 2, 72, title, {
            fontSize: '24px',
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
        const titleFrame = this.add.image(width / 2, 75, 'frame_pseudo_new');
        titleFrame.setScale(frameScale);
        titleFrame.setDepth(0);
        titleText.setDepth(1);

        // Afficher les pièces avec cadre - IDENTIQUE AU MENU PRINCIPAL
        const coins = this.progression.getCoins();
        const coinContainer = this.add.container(width - 120, 40);
        
        const frameBg = this.add.image(0, 0, 'frame_coins');
        frameBg.setScale(0.22);
        coinContainer.add(frameBg);
        
        this.coinsText = this.add.text(18, 0, coins.toString(), {
            fontSize: '22px',
            fontFamily: '"Arial Black", sans-serif',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        coinContainer.add(this.coinsText);
    }

    createTabs(width) {
        const lang = this.lang?.getLanguage() || 'fr';
        const tabLabels = {
            fr: { shop: 'Boutique', cursors: 'Curseurs', avatars: 'Avatars' },
            en: { shop: 'Shop', cursors: 'Cursors', avatars: 'Avatars' },
            de: { shop: 'Shop', cursors: 'Cursor', avatars: 'Avatars' }
        };
        const labels = tabLabels[lang] || tabLabels.fr;
        
        const tabs = [
            { key: 'shop', label: labels.shop, icon: '🛒' },
            { key: 'cursors', label: labels.cursors, icon: '🎯' },
            { key: 'avatars', label: labels.avatars, icon: '👤' }
        ];

        // Onglets à GAUCHE verticalement - taille identique à GlobalLeaderboard
        const tabSpacing = 70;
        const startX = 115;
        const startY = 230;

        tabs.forEach((tab, index) => {
            const x = startX;
            const y = startY + index * tabSpacing;
            const isActive = tab.key === this.currentTab;
            
            // Cadre de l'onglet - même taille que GlobalLeaderboard
            const tabFrame = this.add.image(x, y, 'btn_tab_gold_small');
            tabFrame.setScale(0.28);
            tabFrame.setAlpha(isActive ? 1 : 0.6);
            
            // Texte de l'onglet
            const label = this.add.text(x, y, `${tab.icon} ${tab.label}`, {
                fontSize: '13px', 
                fontFamily: '"Arial Black", sans-serif',
                color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5);
            label.setAlpha(isActive ? 1 : 0.7);
            
            // Zone cliquable
            const hitArea = this.add.rectangle(x, y, 160, 55, 0xFFFFFF, 0);
            hitArea.setInteractive({ useHandCursor: true });
            
            hitArea.on('pointerover', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.9);
                    label.setAlpha(1);
                }
            });
            hitArea.on('pointerout', () => { 
                if (!isActive) {
                    tabFrame.setAlpha(0.6);
                    label.setAlpha(0.7);
                }
            });
            hitArea.on('pointerdown', () => {
                if (this.game.soundManager) this.game.soundManager.playClickSound();
                if (tab.key !== this.currentTab) {
                    this.currentTab = tab.key;
                    this.scene.restart();
                }
            });
        });
    }

    showTabContent(width, height) {
        switch (this.currentTab) {
            case 'shop': this.createShopContent(width, height); break;
            case 'cursors': this.createCursorsContent(width, height); break;
            case 'avatars': this.createAvatarsContent(width, height); break;
        }
    }

    // === BOUTIQUE ===
    createShopContent(width, height) {
        const lang = this.lang?.getLanguage() || 'fr';
        const coins = this.progression.getCoins();
        const jokers = this.progression.getJokers();
        
        // Cadre principal - même taille que succès (1.6 x 1.6)
        const frameX = width / 2 + 80;
        const frameY = 380;
        const contentFrame = this.add.image(frameX, frameY, 'cadre_grand');
        contentFrame.setScale(1.6, 1.6);
        this.contentContainer.add(contentFrame);
        
        const startY = 165;
        
        const texts = {
            fr: { title: '🛒 ACHETER DES JOKERS', owned: 'Possédés', buy: 'ACHETER',
                  fifty: 'Réduit la timeline de moitié', extra: '+5 secondes de temps', skip: 'Passe une question' },
            en: { title: '🛒 BUY JOKERS', owned: 'Owned', buy: 'BUY',
                  fifty: 'Reduces timeline by half', extra: '+5 seconds of time', skip: 'Skip a question' },
            de: { title: '🛒 JOKER KAUFEN', owned: 'Besitz', buy: 'KAUFEN',
                  fifty: 'Halbiert die Timeline', extra: '+5 Sekunden Zeit', skip: 'Frage überspringen' }
        };
        const t = texts[lang] || texts.fr;

        this.contentContainer.add(this.add.text(frameX, startY, t.title, {
            fontSize: '24px', fontFamily: '"Arial Black", sans-serif', color: '#FFD700', stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5));

        const jokerItems = [
            { key: 'fiftyFifty', emoji: '➗', name: '50/50', desc: t.fifty, price: 100, count: jokers.fiftyFifty },
            { key: 'extraTime', emoji: '⏰', name: '+5s', desc: t.extra, price: 75, count: jokers.extraTime },
            { key: 'skip', emoji: '⏭️', name: 'Skip', desc: t.skip, price: 150, count: jokers.skip }
        ];

        jokerItems.forEach((item, index) => {
            const y = startY + 90 + index * 130;
            
            // Cadre doré - PLUS HAUT (0.70 x 0.30)
            const itemFrame = this.add.image(frameX, y, 'frame_pseudo_new');
            itemFrame.setScale(0.70, 0.30);
            this.contentContainer.add(itemFrame);
            
            // Emoji - plus grand
            this.contentContainer.add(this.add.text(frameX - 290, y, item.emoji, { fontSize: '34px' }).setOrigin(0, 0.5));
            
            // Nom et description - plus grands et lisibles
            this.contentContainer.add(this.add.text(frameX - 240, y - 16, item.name, {
                fontSize: '22px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0, 0.5));
            this.contentContainer.add(this.add.text(frameX - 240, y + 16, item.desc, {
                fontSize: '14px', fontFamily: '"Arial Black", sans-serif', color: '#CCCCCC', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0, 0.5));
            
            // Quantité possédée - plus grand
            this.contentContainer.add(this.add.text(frameX + 50, y, `${t.owned}: ${item.count}`, {
                fontSize: '16px', fontFamily: '"Arial Black", sans-serif', color: '#FF69B4', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5));
            
            // Bouton acheter - plus grand
            const canBuy = coins >= item.price;
            const btnBg = this.add.graphics();
            btnBg.fillStyle(canBuy ? 0x00D9A5 : 0x444444, 1);
            btnBg.fillRoundedRect(frameX + 165, y - 28, 120, 56, 10);
            this.contentContainer.add(btnBg);
            
            this.contentContainer.add(this.add.text(frameX + 225, y - 8, `💰 ${item.price}`, {
                fontSize: '17px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5));
            this.contentContainer.add(this.add.text(frameX + 225, y + 14, t.buy, {
                fontSize: '13px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 3
            }).setOrigin(0.5));
            
            if (canBuy) {
                const hitArea = this.add.rectangle(frameX + 225, y, 120, 56, 0xFFFFFF, 0);
                hitArea.setInteractive({ useHandCursor: true });
                hitArea.on('pointerdown', () => {
                    if (this.game.soundManager) this.game.soundManager.playClickSound();
                    this.progression.spendCoins(item.price);
                    this.progression.addJoker(item.key);
                    this.scene.restart();
                });
            }
        });
    }

    // === CURSEURS ===
    createCursorsContent(width, height) {
        const cursors = this.progression.getCursors();
        
        // Cadre principal
        const panelX = width / 2 + 80;
        const panelY = 380;
        
        // Cadre image
        const contentFrame = this.add.image(panelX, panelY, 'cadre_grand');
        contentFrame.setScale(1.6);
        this.contentContainer.add(contentFrame);
        
        // Masque pour le scroll - REDUIT pour rester dans le cadre
        const maskShape = this.add.graphics();
        maskShape.fillStyle(0xFFFFFF);
        maskShape.fillRect(panelX - 400, panelY - 180, 800, 360);
        maskShape.setVisible(false);
        const mask = maskShape.createGeometryMask();
        
        // Container scrollable pour les curseurs
        this.cursorsContainer = this.add.container(0, 0);
        this.cursorsContainer.setMask(mask);
        this.contentContainer.add(this.cursorsContainer);
        
        const cols = 4;
        const itemSize = 140;
        const spacingX = 40;
        const spacingY = 35;
        // Position de départ - centrée
        const startY = panelY - 100;
        const startX = panelX - (cols - 1) * (itemSize + spacingX) / 2;

        Object.entries(cursors).forEach(([key, cursor], index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (itemSize + spacingX);
            const y = startY + row * (itemSize + spacingY);
            
            const isUnlocked = this.progression.unlockedCursors.includes(key);
            const isActive = this.progression.currentCursor === key;
            
            // Cadre carré doré - agrandi
            const frame = this.add.image(x, y, 'frame_item_square');
            frame.setScale(0.26);
            if (isActive) {
                frame.setTint(0xFFD700); // Doré si actif
            } else if (!isUnlocked) {
                frame.setTint(0x666666); // Gris si verrouillé
            }
            this.cursorsContainer.add(frame);
            
            // Image du curseur - TOUJOURS affichée (assombrie si bloqué)
            if (this.textures.exists(cursor.image)) {
                const cursorImg = this.add.image(x, y, cursor.image);
                cursorImg.setScale(0.26);
                if (!isUnlocked) {
                    cursorImg.setTint(0x333333);
                    cursorImg.setAlpha(0.5);
                }
                this.cursorsContainer.add(cursorImg);
            }
            
            // Nom du curseur en bas
            this.cursorsContainer.add(this.add.text(x, y + 70, cursor.name, {
                fontSize: '12px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2, fontStyle: 'bold'
            }).setOrigin(0.5));
            
            // Niveau requis si bloqué - cadenas par dessus
            if (!isUnlocked) {
                this.cursorsContainer.add(this.add.text(x, y, '🔒', { fontSize: '28px' }).setOrigin(0.5));
                this.cursorsContainer.add(this.add.text(x, y + 85, `Niv. ${cursor.level}`, { 
                    fontSize: '11px', color: '#FF8800', stroke: '#000000', strokeThickness: 2, fontFamily: '"Arial Black", sans-serif', fontStyle: 'bold'
                }).setOrigin(0.5));
            } else if (isActive) {
                this.cursorsContainer.add(this.add.text(x, y + 85, '✓ Actif', { 
                    fontSize: '11px', color: '#00FF66', stroke: '#000000', strokeThickness: 2, fontFamily: '"Arial Black", sans-serif'
                }).setOrigin(0.5));
            }
            
            // Interaction
            if (isUnlocked && !isActive) {
                const hitArea = this.add.rectangle(x, y, itemSize, itemSize, 0xFFFFFF, 0);
                hitArea.setInteractive({ useHandCursor: true });
                this.cursorsContainer.add(hitArea);
                hitArea.on('pointerdown', () => { 
                    if (this.game.soundManager) this.game.soundManager.playClickSound();
                    this.progression.setCursor(key); 
                    this.scene.restart(); 
                });
            }
        });
        
        // Setup du scroll
        const totalRows = Math.ceil(Object.keys(cursors).length / cols);
        const contentHeight = totalRows * (itemSize + spacingY);
        const maxScroll = Math.max(0, contentHeight - 400);
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (pointer.x > panelX - 430 && pointer.x < panelX + 430 &&
                pointer.y > panelY - 250 && pointer.y < panelY + 230) {
                this.cursorsContainer.y = Phaser.Math.Clamp(
                    this.cursorsContainer.y - deltaY * 0.5,
                    -maxScroll,
                    0
                );
            }
        });
    }

    // === AVATARS ===
    createAvatarsContent(width, height) {
        // Avatar data with CORRECT names matching images
        // avatar_1 = Bières, avatar_2 = Parchemin, avatar_3 = Cristal, avatar_4 = Coffre
        // avatar_5 = Potion, avatar_6 = Jambon, avatar_7 = Bouclier, avatar_8 = Épée
        // avatar_9 = Sac d'or, avatar_10 = Outils, avatar_11 = Haches
        const allAvatars = [
            { key: 'avatar_4', name: 'Coffre', level: 1 },
            { key: 'avatar_9', name: 'Sac d\'or', level: 5 },
            { key: 'avatar_6', name: 'Jambon', level: 10 },
            { key: 'avatar_7', name: 'Bouclier', level: 15 },
            { key: 'avatar_1', name: 'Bières', level: 20 },
            { key: 'avatar_11', name: 'Haches', level: 25 },
            { key: 'avatar_8', name: 'Épée', level: 30 },
            { key: 'avatar_10', name: 'Outils', level: 35 },
            { key: 'avatar_5', name: 'Potion', level: 40 },
            { key: 'avatar_2', name: 'Parchemin', level: 45 },
            { key: 'avatar_3', name: 'Cristal', level: 50 }
        ];
        
        // Cadre principal
        const panelX = width / 2 + 80;
        const panelY = 380;
        
        // Cadre image
        const contentFrame = this.add.image(panelX, panelY, 'cadre_grand');
        contentFrame.setScale(1.6);
        this.contentContainer.add(contentFrame);
        
        // Masque pour le scroll - REDUIT pour rester dans le cadre
        const maskShape = this.add.graphics();
        maskShape.fillStyle(0xFFFFFF);
        maskShape.fillRect(panelX - 400, panelY - 180, 800, 360);
        maskShape.setVisible(false);
        const mask = maskShape.createGeometryMask();
        
        // Container scrollable pour les avatars
        this.avatarsContainer = this.add.container(0, 0);
        this.avatarsContainer.setMask(mask);
        this.contentContainer.add(this.avatarsContainer);
        
        const cols = 4;
        const itemSize = 140;
        const spacingX = 40;
        const spacingY = 35;
        const startY = panelY - 100;
        const startX = panelX - (cols - 1) * (itemSize + spacingX) / 2;

        allAvatars.forEach((avatar, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (itemSize + spacingX);
            const y = startY + row * (itemSize + spacingY);
            
            // Level 1 avatars are ALWAYS unlocked
            const isUnlocked = avatar.level === 1 || this.progression.unlockedAvatars.includes(avatar.key);
            const isActive = this.progression.currentAvatar === avatar.key;
            
            // Cadre carré doré - agrandi
            const frame = this.add.image(x, y, 'frame_item_square');
            frame.setScale(0.26);
            if (isActive) {
                frame.setTint(0xFFD700); // Doré si actif
            } else if (!isUnlocked) {
                frame.setTint(0x666666); // Gris si verrouillé
            }
            this.avatarsContainer.add(frame);
            
            // Avatar image
            if (this.textures.exists(avatar.key)) {
                const avatarImg = this.add.image(x, y, avatar.key);
                avatarImg.setScale(0.20);
                if (!isUnlocked) {
                    avatarImg.setTint(0x333333);
                    avatarImg.setAlpha(0.5);
                }
                this.avatarsContainer.add(avatarImg);
            }
            
            // Lock icon and level if not unlocked
            if (!isUnlocked) {
                this.avatarsContainer.add(this.add.text(x, y, '🔒', { fontSize: '28px' }).setOrigin(0.5));
                this.avatarsContainer.add(this.add.text(x, y + 85, `Niv. ${avatar.level}`, { 
                    fontSize: '11px', color: '#FF8800', stroke: '#000000', strokeThickness: 2, fontFamily: '"Arial Black", sans-serif', fontStyle: 'bold'
                }).setOrigin(0.5));
            }
            
            // Name label
            this.avatarsContainer.add(this.add.text(x, y + 70, avatar.name, {
                fontSize: '12px', fontFamily: '"Arial Black", sans-serif', color: '#FFFFFF', stroke: '#000000', strokeThickness: 2, fontStyle: 'bold'
            }).setOrigin(0.5));
            
            // Active indicator
            if (isActive) {
                this.avatarsContainer.add(this.add.text(x, y + 85, '✓ Actif', { 
                    fontSize: '11px', color: '#00FF66', stroke: '#000000', strokeThickness: 2, fontFamily: '"Arial Black", sans-serif', fontStyle: 'bold'
                }).setOrigin(0.5));
            }
            
            // Click interaction
            if (isUnlocked && !isActive) {
                const hitArea = this.add.rectangle(x, y, itemSize, itemSize, 0xFFFFFF, 0);
                hitArea.setInteractive({ useHandCursor: true });
                hitArea.on('pointerdown', () => { 
                    if (this.game.soundManager) this.game.soundManager.playClickSound();
                    this.progression.setAvatar(avatar.key); 
                    this.scene.restart(); 
                });
                this.avatarsContainer.add(hitArea);
            }
        });
        
        // Setup du scroll
        const totalRows = Math.ceil(allAvatars.length / cols);
        const contentHeight = totalRows * (itemSize + spacingY);
        const maxScroll = Math.max(0, contentHeight - 400);
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (pointer.x > panelX - 430 && pointer.x < panelX + 430 &&
                pointer.y > panelY - 250 && pointer.y < panelY + 230) {
                this.avatarsContainer.y = Phaser.Math.Clamp(
                    this.avatarsContainer.y - deltaY * 0.5,
                    -maxScroll,
                    0
                );
            }
        });
    }

    createBackButton() {
        const btn = this.add.image(100, 50, 'btn_back_new');
        btn.setScale(0.22);
        btn.setInteractive({ useHandCursor: true });
        
        btn.on('pointerover', () => btn.setScale(0.25));
        btn.on('pointerout', () => btn.setScale(0.22));
        btn.on('pointerdown', () => {
            btn.setScale(0.20);
            if (this.game.soundManager) this.game.soundManager.playClickSound();
            this.cameras.main.fadeOut(250);
            this.time.delayedCall(250, () => this.scene.start('MenuScene'));
        });
    }
}

window.LeaderboardScene = LeaderboardScene;
