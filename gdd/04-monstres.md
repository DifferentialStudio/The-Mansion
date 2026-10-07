# 04 — Monstres

← [Monde](03-monde-et-build.md) · [Index](README.md) · [Systèmes →](05-systemes.md)

---

## Règles globales `[VALIDÉ]`

| Règle | Valeur |
|-------|--------|
| Monstres par partie | **1 seul** |
| Capture | Moment fort de la run (plusieurs techniques possibles par monstre) |
| Techniques de chasse listées ici | **Exemples** — d’autres techniques seront développées plus tard |

### Principes

| Principe | Statut |
|----------|--------|
| Chaque monstre a une règle de comportement lisible | `[VALIDÉ]` |
| Capture = préparation + exécution, pas farm | `[VALIDÉ]` |
| Peu de types alpha, fiches solides | Intention alpha |

---

## Marcheur `[VALIDÉ]` `[ALPHA]`

### Design

| Élément | Description |
|---------|-------------|
| Tête | Brûlée, **plus d’yeux** |
| Taille | Standard |
| Ambiance | Créature démoniaque “aveugle” / brûlée |

### Comportement

- Se promène dans le manoir
- **Attiré par le bruit**

### Exemple de chasse (plusieurs techniques à venir)

1. Récupérer une **boîte à musique** pour l’attirer
2. Le **bloquer**
3. Le **brûler**

| Étape | Action joueur | Fail possible |
|-------|---------------|---------------|
| 1. Attirer | Boîte à musique | Bruit mal géré / monstre ailleurs |
| 2. Bloquer | `[À REMPLIR — comment bloquer exactement]` | Escape du monstre |
| 3. Éliminer | Brûler | Timing raté / items manquants |

---

## Crieur `[VALIDÉ]` `[ALPHA]`

### Design

| Élément | Description |
|---------|-------------|
| Silhouette | **Plus grand**, mince |
| Tête | Démoniaque, **bouche ouverte** et sourire |
| Taille | Plus grand que le joueur |

### Comportement

- Quand on le **regarde** ou qu’on est **trop près** : il **chase** comme un BTR (charge / poursuite agressive)

### Exemple de chasse (plusieurs techniques à venir)

1. Trouver une **hache**
2. **Creuser un trou** dans le couloir (**ne pas tomber** dedans)
3. Mettre des **piques en bois** / **boîte à clous**
4. **Attirer** dans le trou
5. **Foutre le feu**

| Étape | Action joueur | Fail possible |
|-------|---------------|---------------|
| 1. Outil | Hache | Pas trouvé à temps |
| 2. Terrain | Trou dans le couloir | Joueur tombe / mauvais placement |
| 3. Piège | Piques / clous | Setup incomplet |
| 4. Attract | Attirer le Crieur | Chase mortelle si mal géré |
| 5. Finish | Feu | Monstre sort du trou |

---

## Autres monstres

| ID | Nom | Priorité | Statut |
|----|-----|----------|--------|
| M01 | Marcheur | Alpha | Fiche ci-dessus |
| M02 | Crieur | Alpha | Fiche ci-dessus |
| M03+ | `[À REMPLIR]` | Plus tard | — |

---

## Template fiche monstre

```md
### [NOM]
- Statut : [ALPHA] / [PLUS TARD]
- Design :
- Comportement :
- Comment le détecter :
- Exemple(s) de capture :
- Fail states :
- Notes audio / visuelles :
```
