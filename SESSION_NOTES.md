# TIMEGUESS - Journal de Développement

## 📋 Résumé du Projet
**Nom**: TIMEGUESS - Timeline Battle Solo
**Type**: Jeu de quiz chronologique en Phaser 3
**Langues**: Français, Anglais, Allemand (trilingue complet)
**Questions**: 538 questions (IDs 1-549, avec trous)

---

## 🎮 Fonctionnalités Principales

### Modes de jeu
- **Classique**: 10 questions, score à atteindre
- **Survie**: Vies limitées, jouer jusqu'à l'élimination
- **Contre-la-montre**: Temps limité
- **Duel IA**: Affrontement contre une IA
- **Décennie**: Questions filtrées par décennie

### Difficultés
- Facile, Normal, Difficile, Expert

### Catégories (10)
- Mixte, Musique, Anime, Culture, Sports, Cinéma, Jeux Vidéo, Science, Géographie, Insolite

### Système de progression
- Niveaux et XP
- Pièces virtuelles (monnaie)
- Jokers (50/50, +5s, Passer)
- Succès/Achievements
- Défis quotidiens
- Coffre quotidien
- Thèmes débloquables
- Avatars
- Titres

### Classements
- Local (localStorage)
- Global (Firebase Realtime Database)

---

## 🖼️ Assets Graphiques Personnalisés (Session 21-22)

### Images intégrées dans `/assets/images/`:

| Fichier | Description | Scale utilisé |
|---------|-------------|---------------|
| `logo.png` | Logo TIMEGUESS avec horloge et sablier | 0.35 |
| `background.png` | Fond violet/rose avec planète cristal | cover |
| `btn_play.png` | Bouton PLAY turquoise/vert | 0.28 |
| `btn_profile.png` | Icône profil cercle bleu | 0.7 |
| `btn_leaderboard.png` | Icône trophée cercle bleu | 0.7 |
| `btn_global.png` | Icône globe cercle bleu | 0.7 |
| `btn_settings.png` | Icône engrenage cercle bleu | 0.7 |
| `btn_daily_chest.png` | Bouton cadeau doré avec ruban rouge | 0.08 |
| `frame_pseudo.png` | Cadre doré pour pseudo avec icône user | 0.25 |
| `frame_level.png` | Cadre violet/rose pour niveau | 0.22 |
| `frame_challenges.png` | Cadre violet/bleu pour défis | 0.22 x 0.42 |
| `frame_coins.png` | Cadre doré pour compteur pièces | 0.14 |
| `flag_fr.png` | Drapeau français doré | 0.22/0.18 |
| `flag_gb.png` | Drapeau britannique doré | 0.22/0.18 |
| `flag_de.png` | Drapeau allemand doré | 0.22/0.18 |

---

## 📐 Layout MenuScene (positions en % de height)

```
┌─────────────────────────────────────────────────────────┐
│ [Drapeaux FR/GB/DE]              [Coins 💰]  [Cadeau 🎁] │  y: 35-115
│                    x: 130                    x: width-65 │
│                                                          │
│                    ╔═══════════════╗                     │
│                    ║   TIMEGUESS   ║                     │  y: 22%
│                    ╚═══════════════╝                     │
│                                                          │
│              ┌─────────────────────────┐                 │
│              │  👤  [pseudo input]     │                 │  y: 48%
│              └─────────────────────────┘                 │
│                                                          │
│              ┌─────────────────────────┐                 │
│              │    ▶▶  JOUER/PLAY      │                 │  y: 64%
│              └─────────────────────────┘                 │
│                                                          │
│         (👤)    (🏆)    (🌍)    (⚙️)                     │  y: 82%
│        Profile Leaderb  Global  Settings                 │
│                                                          │
│ [Lv.10 ████ 27%]                    ┌──────────────┐    │
│                                     │ 📅 QUESTS    │    │  y: height-80
│                                     │ • défi 1     │    │
│                                     │ • défi 2     │    │
│                                     │ • défi 3     │    │
│                                     └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Configurations Techniques

### Phaser Config (main.js)
```javascript
fps: { target: 60, forceSetTimeOut: false }
render: { pixelArt: false, antialias: true, roundPixels: false }
```

### Animations fluides
- Logo: flottement vertical ±2px, durée 3000ms, ease Sine.easeInOut
- Cadeau: flottement vertical ±3px, durée 2000ms, ease Sine.easeInOut
- Pas d'animation de scale (causait du saccadement)

---

## 📝 Traductions Clés

### Menu
- FR: JOUER | EN: PLAY | DE: SPIELEN
- FR: Profil | EN: Profile | DE: Profil
- FR: Classement | EN: Leaderboard | DE: Rangliste
- FR: Classement Mondial | EN: World Ranking | DE: Weltrangliste
- FR: Options | EN: Settings | DE: Optionen

### Défis quotidiens
- FR: 📅 DÉFIS | EN: 📅 QUESTS | DE: 📅 AUFGABEN

### Coffre quotidien
- FR: Ouvrir! | EN: Open! | DE: Öffnen!

---

## 📁 Structure des Fichiers Modifiés

```
timeline-battle-solo/
├── assets/images/          # Tous les assets graphiques
├── css/style.css
├── data/
│   ├── questions.json      # 538 questions FR
│   ├── questions_en.json   # 538 questions EN
│   └── questions_de.json   # 288 questions DE
├── js/
│   ├── config.js
│   ├── main.js             # Config Phaser + FPS 60
│   ├── managers/
│   │   ├── Translations.js # Système trilingue
│   │   ├── ProgressionManager.js
│   │   └── ...
│   └── scenes/
│       ├── MenuScene.js    # UI principale avec tous les assets
│       ├── GameScene.js    # Traductions feedback
│       ├── ProfileScene.js # Traductions shop/tabs
│       └── ...
└── SESSION_NOTES.md        # Ce fichier
```

---

## 🚀 Pour Continuer le Développement

Dans une nouvelle conversation:
1. Upload le fichier ZIP
2. Dis: "Lis SESSION_NOTES.md et continue le développement"
3. Je saurai exactement où on en est!

---

## 📌 Dernières Modifications (Session 22)

1. ✅ Fond d'écran violet/rose remplacé
2. ✅ Drapeaux de langue personnalisés (dorés, à gauche)
3. ✅ Bouton cadeau quotidien personnalisé
4. ✅ Cadre pseudo doré avec icône intégrée
5. ✅ Label "Ton nom" supprimé
6. ✅ Pseudo agrandi (28px) et centré
7. ✅ Animations rendues fluides (flottement au lieu de scale)
8. ✅ FPS forcé à 60

---

## 📌 Modifications Session v47-v58

### Système de Curseurs (remplace les thèmes)
- 11 curseurs personnalisés déblocables (cursor_1.png à cursor_11.png)
- Curseur 1 = défaut (débloqué), 2-11 = à acheter avec pièces
- Shop de curseurs dans ProfileScene avec scroll
- Curseurs convertis en PNG RGBA avec transparence (fond noir supprimé)
- Curseurs verrouillés : affichés assombris avec icône cadenas

### Classement Mondial (GlobalLeaderboardScene)
- Nouveau cadre doré : `frame_leaderboard.png` (1536x1024, PNG transparent)
- Cadre dimensionné : `setDisplaySize(panelW + 80, panelH + 60)`
- Panel : panelY=180, panelW=850, panelH=height-220
- 6 onglets : Tous, Classic, Survie, Chrono, Duel, Aujourd'hui
- Colonnes : #, Joueur, Score, Mode, Catégorie, Combo
- Scroll avec masque pour les scores

### Drapeaux de Langue (MenuScene)
- Position verticale (colonne) au lieu d'horizontale
- Container position : x=80, y=140
- Espacement : y = -55, 0, +55 (FR en haut, EN milieu, DE bas)
- Scale : actif=0.26, inactif=0.20

### Assets Mis à Jour
| Fichier | Description |
|---------|-------------|
| cursor_1.png à cursor_11.png | Curseurs avec fond transparent |
| frame_leaderboard.png | Cadre doré classement mondial |

---

## 🎯 Idées pour la Suite

- Ajouter plus de questions
- Nouveaux thèmes visuels
- Mode multijoueur
- Sons/musique personnalisés
- ~~Tutoriel interactif~~ ✅ FAIT (v59)
- Plus de langues (ES, IT, etc.)

---

## 📌 Modifications Session v59

### Tutoriel Interactif (TutorialScene)
- 9 étapes interactives expliquant le jeu
- Visuel animé pour chaque étape (timeline, curseur, jokers, etc.)
- Traductions complètes FR/EN/DE
- Navigation avec boutons Précédent/Suivant/Passer
- Animation du curseur sur la timeline pour montrer comment jouer
- Indicateur visuel des étapes (points)
- Bouton "Comment jouer ?" dans le menu principal
- Animation clignotante pour les nouveaux joueurs
- Mémorise si le joueur a déjà vu le tutoriel (localStorage)

### Fichiers Modifiés
- `js/scenes/TutorialScene.js` - Nouvelle scène (créée)
- `js/scenes/MenuScene.js` - Ajout bouton tutoriel
- `js/main.js` - Ajout TutorialScene dans la liste des scènes
- `index.html` - Ajout script TutorialScene.js (v12)

---

## 📌 Modifications Session v60

### Nouveaux Assets Graphiques
| Fichier | Description |
|---------|-------------|
| `fenetre_pause.png` | Nouveau cadre doré avec trophée pour la fenêtre pause |
| `btn_wood_oval.png` | Bouton bois ovale avec feuilles (pour boutons et tutoriel) |

### Menu Pause (PauseScene)
- Nouvelle fenêtre de pause avec cadre doré/violet (`fenetre_pause.png`)
- Boutons "REPRENDRE" et "MENU" en style bois ovale (`btn_wood_oval.png`)
- Titre "PAUSE" dans la zone violette du haut
- Texte en couleur marron bois (#5D4E37) avec stroke doré

### Menu Principal (MenuScene)
- Bouton Tutoriel déplacé à **gauche de l'écran** (sous les drapeaux)
- Bouton Tutoriel en style bois ovale avec icône 📖
- Animation de pulsation pour les nouveaux joueurs
- Texte traduit : TUTORIEL / TUTORIAL / ANLEITUNG

### Fichiers Modifiés
- `assets/images/fenetre_pause.png` (nouveau)
- `assets/images/btn_wood_oval.png` (nouveau)
- `js/scenes/PauseScene.js` - Nouvelle fenêtre et boutons bois
- `js/scenes/MenuScene.js` - Bouton tutoriel à gauche avec style bois
- `index.html` - Version v13

---

## 📌 Modifications Session v93-v107

### v93 - Barre FAUX abaissée
- Position feedback "FAUX": y=260 → y=320

### v94 - Cadre pièces agrandi (Personnalisation)
- Scale: 0.12 → 0.18
- Texte: 18px → 24px

### v95 - Barre FAUX encore plus basse
- Position: y=320 → y=380

### v96 - Boutons menu pause agrandis
- Scale bouton: 0.12 → 0.22
- Texte: 11px → 18px
- Espacement: 60px → 100px

### v97 - Compteur pièces identique au menu principal
- Position: (width-120, 40)
- Scale: 0.22, texte 20px, couleur #5D4E37

### v98 - Barre FAUX remontée
- Position: y=380 → y=340

### v99 - Boutons décennies plus espacés
- Espacement horizontal: 220px → 280px
- Espacement vertical: 80px → 95px

### v100 - Cœurs agrandis
- Taille: 14px → 20px

### v101 - Titre profil = pseudo du joueur
- Affiche le pseudo au lieu de "MON PROFIL"
- Lit depuis localStorage('timeguess_pseudo')

### v102 - Cadre niveau avec avatar (menu principal)
- Ajout de l'avatar du joueur
- Utilisation de frame_level

### v103 - Score/vies rapprochés + timer timeattack
- Score et vies rapprochés du centre dans le cadre
- Timer 15s par question désactivé en mode contre-la-montre
- Seul le timer global 60s reste affiché

### v104 - Retour à frame_wood
- Scale uniforme 0.25 (sans déformation)

### v105 - Pseudo depuis localStorage
- ProfileScene lit timeguess_pseudo pour afficher le vrai pseudo

### v106 - Cadre niveau plus petit et remonté
- Scale: 0.18, position height-55

### v107 - Cadre niveau allongé et remonté
- Position: height-70
- Scale: 0.22 x 0.16 (allongé horizontalement)
- Barre XP: 70px
- Avatar repositionné à x=-85

### Fichiers principaux modifiés (v93-v107)
- `js/scenes/GameScene.js` - feedback FAUX, timer, score/vies
- `js/scenes/LeaderboardScene.js` - coins display personnalisation
- `js/scenes/PauseScene.js` - boutons agrandis et espacés
- `js/scenes/ProfileScene.js` - pseudo depuis localStorage
- `js/scenes/MenuScene.js` - cadre niveau avec avatar

### Points d'attention
- Le pseudo est stocké dans localStorage sous 'timeguess_pseudo'
- Mode timeattack: pas de timer par question, seulement timer global 60s
- Feedback FAUX positionné à y=340 (entre question et timeline)
- Cadre niveau: frame_wood avec scale 0.22 x 0.16
