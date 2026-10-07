# The Mansion

Site qui expose le **Game Design Document** du jeu Roblox The Mansion.

## Contenu

| Chemin | Rôle |
|--------|------|
| `gdd/` | Cahier des charges (markdown) |
| `gdd.html` | Lecteur web du GDD |
| `index.html` | Accueil |
| `assets/` | CSS / JS |

## GitHub Pages

1. Settings → Pages → Source : **Deploy from a branch**
2. Branch `main`, dossier `/ (root)`
3. Ouvrir `https://<user>.github.io/<repo>/`

Le fichier `.nojekyll` empêche le traitement Jekyll.

**Note :** avec Pages en gratuit, le repo est en général **public** — le GDD est donc lisible par tout le monde. C’est voulu pour ce site.

## Développement local

Le lecteur charge le markdown via `fetch` : utilise un serveur HTTP, pas `file://`.

```powershell
npx --yes serve .
```

Puis ouvre `http://localhost:3000` (ou le port indiqué).

## GDD

Voir [`gdd/README.md`](gdd/README.md). Version : **0.2**.
