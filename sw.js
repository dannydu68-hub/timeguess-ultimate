// Service Worker for TimeGuess PWA
const CACHE_NAME = 'timeguess-v155';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/config.js',
  '/js/managers/ProgressionManager.js',
  '/js/managers/StatsManager.js',
  '/js/managers/SoundManager.js',
  '/js/managers/ParticleManager.js',
  '/js/managers/Translations.js',
  '/js/managers/AchievementManager.js',
  '/js/managers/FirebaseManager.js',
  '/js/scenes/MenuScene.js',
  '/js/scenes/GameScene.js',
  '/js/scenes/ResultScene.js',
  '/js/scenes/ProfileScene.js',
  '/js/scenes/ModeScene.js',
  '/js/scenes/CategoryScene.js',
  '/js/scenes/DifficultyScene.js',
  '/js/scenes/LeaderboardScene.js',
  '/js/scenes/SettingsScene.js',
  '/js/scenes/PauseScene.js',
  '/js/scenes/TutorialScene.js',
  '/js/scenes/TransitionScene.js',
  '/js/scenes/StatsScene.js',
  '/js/scenes/GlobalLeaderboardScene.js',
  '/js/components/Timeline.js',
  '/js/components/Marker.js',
  '/data/questions.json',
  '/data/questions_en.json',
  '/data/questions_de.json',
  '/assets/images/background.png',
  '/assets/images/background2.png',
  '/assets/images/background_night.png',
  '/assets/images/logo.png',
  '/assets/images/timeline.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache failed:', err);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Clone and cache new resources
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        return caches.match('/index.html');
      })
  );
});
