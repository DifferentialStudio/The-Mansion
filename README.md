# The Mansion

Site officiel + Game Design Document pour le jeu Roblox **The Mansion**.

## Contenu du repo

| Dossier | Rôle |
|---------|------|
| `gdd/` | Cahier des charges (source de vérité design) |
| `community/` | Zone publique : wiki, updates, events |
| `developer/` | Zone équipe (mot de passe) |
| `assets/` | CSS / JS du site |
| `index.html` | Landing |

## GitHub Pages

1. Repo **privé recommandé** (sinon le GDD est clonable par tout le monde).
2. Settings → Pages → Source : **Deploy from a branch**.
3. Branch `main` (ou `master`), dossier `/ (root)`.
4. Attendre 1–2 minutes, ouvrir `https://<user>.github.io/<repo>/`.

Le fichier `.nojekyll` empêche GitHub de traiter le site avec Jekyll.

### Limites du service

- Fichiers **statiques** uniquement (pas de backend).
- Le mot de passe développeur est une **gate côté navigateur** (filtre casual), pas une auth serveur.
- Pour protéger le GDD : garde le repo **privé**. La gate évite surtout que les joueurs tombent sur les docs en naviguant.

## Mot de passe développeur

Mot de passe par défaut : `mansion-dev`

Change-le avant de partager le site :

1. Calcule le SHA-256 hex du nouveau mot de passe (PowerShell) :

```powershell
$b = [Text.Encoding]::UTF8.GetBytes('ton-nouveau-mdp')
-join ([Security.Cryptography.SHA256]::Create().ComputeHash($b) | ForEach-Object { $_.ToString('x2') })
```

2. Remplace `PASSWORD_HASH` dans [`assets/js/dev-auth.js`](assets/js/dev-auth.js).

## Développement local

Les pages developer chargent le markdown via `fetch` : ouvre le site avec un serveur HTTP local, pas en `file://`.

Exemples :

```powershell
# Si Python est installé
python -m http.server 8080
```

```powershell
# Si tu as npx
npx --yes serve .
```

Puis ouvre `http://localhost:8080`.

## GDD

Voir [`gdd/README.md`](gdd/README.md). Version actuelle : **0.2**.
