# 📻 Vocal Radio PWA

Lanceur vocal de radios françaises, entièrement accessible (TalkBack Android).

## Structure du projet

```
vocal-radio/
├── index.html       ← Application principale (tout-en-un)
├── manifest.json    ← Manifeste PWA (icône, nom, couleurs)
├── sw.js            ← Service Worker (cache offline)
└── icons/           ← Icônes PWA (72→512px)
    ├── icon-72x72.png
    ├── icon-96x96.png
    ├── icon-128x128.png
    ├── icon-144x144.png
    ├── icon-152x152.png
    ├── icon-192x192.png
    ├── icon-384x384.png
    └── icon-512x512.png
```

## Déploiement sur GitHub Pages

1. Créer un nouveau dépôt GitHub (ex: `vocal-radio`)
2. Uploader tous les fichiers (index.html, manifest.json, sw.js, dossier icons/)
3. Aller dans **Settings → Pages → Source : main / root**
4. L'app sera disponible à : `https://<votre-pseudo>.github.io/vocal-radio/`

> ⚠️ GitHub Pages requiert HTTPS — c'est automatique, et c'est obligatoire pour le Service Worker et le WakeLock.

## Radios disponibles

| Nom | Flux |
|-----|------|
| France Inter | icecast.radiofrance.fr/franceinter-hifi.aac |
| France Info | icecast.radiofrance.fr/franceinfo-hifi.aac |
| France Culture | icecast.radiofrance.fr/franceculture-hifi.aac |
| France Musique | icecast.radiofrance.fr/francemusique-hifi.aac |
| France Bleu | icecast.radiofrance.fr/francebleu-hifi.aac |
| FIP | icecast.radiofrance.fr/fip-hifi.aac |

## Commandes vocales

| Commande | Action |
|----------|--------|
| "France Inter" (ou tout nom de radio) | Lance la station |
| "Stop" / "Arrêter" | Arrête la lecture |
| "Menu" | Vocalise la liste des radios |
| "Volume bas" / "Volume fort" | Ajuste le volume |
| "Aide" | Récite les commandes disponibles |

## Notes techniques

- **SpeechRecognition** : nécessite une connexion internet (Google Speech API)
- **WakeLock** : maintient l'écran allumé pendant l'écoute (Android Chrome 84+)
- **Service Worker** : cache les assets statiques, streaming audio toujours en réseau direct
- **TalkBack** : compatible — aria-live, aria-pressed, aria-label sur tous les contrôles

## Mise à jour du cache (sw.js)

Après toute modification, incrémenter la version dans `sw.js` :
```js
const CACHE_NAME = 'vocal-radio-v2'; // ← changer le numéro
```

## Accessibilité

- Navigation clavier complète
- Lien d'évitement ("Aller au contenu principal")
- Annonces vocales automatiques au chargement
- Contraste WCAG AA (jaune #e8ff47 sur noir #0a0a14)
- Touch targets ≥ 44×44px sur tous les boutons
