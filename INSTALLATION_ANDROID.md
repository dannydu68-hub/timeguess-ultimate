# TimeGuess - Installation sur Android

## Option 1: Installer comme PWA (Progressive Web App) - RECOMMANDÉ

C'est la méthode la plus simple pour jouer en plein écran sur Android:

### Étapes:
1. **Héberger le jeu** sur un serveur web (GitHub Pages, Netlify, ou serveur local)
2. **Ouvrir Chrome** sur votre téléphone Android
3. **Visiter le site** du jeu
4. **Appuyer sur les 3 points** (menu) en haut à droite
5. **Sélectionner "Installer l'application"** ou "Ajouter à l'écran d'accueil"
6. **L'icône TimeGuess** apparaîtra sur votre écran d'accueil
7. **Ouvrir l'app** - elle se lancera en plein écran!

### Avantages PWA:
- ✅ Installation instantanée
- ✅ Plein écran automatique
- ✅ Fonctionne hors-ligne
- ✅ Mises à jour automatiques
- ✅ Pas besoin de Play Store

---

## Option 2: Créer une vraie APK avec Android Studio

Si vous voulez créer un fichier .apk installable:

### Prérequis:
- Android Studio installé
- Java JDK 17+
- Node.js installé

### Étapes:

1. **Installer Cordova:**
```bash
npm install -g cordova
```

2. **Créer le projet Cordova:**
```bash
cordova create timeguess-app com.timeguess.game "TimeGuess"
cd timeguess-app
cordova platform add android
```

3. **Copier les fichiers du jeu:**
```bash
# Supprimer le contenu de www/ et copier le jeu
rm -rf www/*
cp -r [chemin_vers_jeu]/* www/
```

4. **Copier les ressources (icônes):**
```bash
mkdir -p res/android
# Copier les icônes depuis le dossier icons/
```

5. **Remplacer config.xml** avec celui fourni dans ce package

6. **Compiler l'APK:**
```bash
cordova build android
```

7. **L'APK sera créé dans:**
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

8. **Transférer et installer** l'APK sur votre téléphone

---

## Option 3: Utiliser un service en ligne

Plusieurs services permettent de convertir un site web en APK:

- **PWA Builder** (https://www.pwabuilder.com/)
  1. Entrez l'URL de votre jeu hébergé
  2. Cliquez sur "Package for stores"
  3. Téléchargez l'APK Android

- **WebIntoApp** (https://www.webintoapp.com/)
- **AppMaker** (https://www.appmaker.com/)

---

## Structure des fichiers pour l'APK

```
timeguess/
├── www/                    # Fichiers du jeu
│   ├── index.html
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   ├── css/
│   ├── js/
│   ├── data/
│   ├── assets/
│   └── icons/             # Icônes PWA
├── res/
│   └── android/           # Icônes Android
│       ├── icon-ldpi.png
│       ├── icon-mdpi.png
│       ├── icon-hdpi.png
│       ├── icon-xhdpi.png
│       ├── icon-xxhdpi.png
│       └── icon-xxxhdpi.png
└── config.xml             # Configuration Cordova
```

---

## Résolution des problèmes

### Le jeu ne s'affiche pas en plein écran
- Assurez-vous que le manifest.json contient `"display": "fullscreen"`
- Sur Android, utilisez Chrome pour installer la PWA

### L'orientation est incorrecte
- Le jeu est conçu pour le mode paysage (landscape)
- Tournez votre téléphone horizontalement

### L'installation PWA n'est pas proposée
- Le site doit être servi en HTTPS
- Le manifest.json doit être correctement configuré
- Le service worker doit être enregistré

---

## Support

Pour toute question, consultez la documentation Cordova:
https://cordova.apache.org/docs/

Ou la documentation PWA de Google:
https://web.dev/progressive-web-apps/
