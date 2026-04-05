# GEID Lisolo

[**GEID Lisolo**](https://geidbudget.com/apps/lisolo/dev/v2/) est une application web collaborative faisant partie de la plateforme **GEID Budget** (Gestion Electronique de l'Information et des Documents). Ce module est dédié à la communication et la collaboration en équipe : réunions en ligne, messagerie, appels audio/vidéo et partage d'écran.

---

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| **TypeScript** | 6.x | Langage principal |
| **React** | 19.x | Framework UI |
| **Vite** | 5.x | Build tool (SWC) |
| **MUI** | 7.x | Composants UI |
| **Redux Toolkit** | 1.9 | Gestion d'état |
| **Redux Persist** | 6.x | Persistance du state |
| **Socket.IO** | 4.x | Communication temps réel |
| **Agora RTC** | 2.x | Visioconférence |
| **Axios** | 1.x | Client HTTP |

---

## Fonctionnalités principales

- **Visioconférence** : appels vidéo multi-participants avec Agora RTC, partage d'écran, annotation en direct (Konva)
- **Messagerie** : chat temps réel via Socket.IO, envoi de fichiers, messages vocaux
- **Effets vidéo** : flou d'arrière-plan, remplacement de fond (TensorFlow / MediaPipe)
- **Suppression du bruit** : filtrage audio (RNNoise WASM)
- **Editeur riche** : texte formaté (Draft.js, Lexical, Slate)
- **QR Code** : génération et scan de codes pour rejoindre les réunions
- **Responsive** : interface adaptée mobile, tablette et desktop

---

## Architecture

```
src/
├── assets/          # Médias, polices, images
├── components/      # Composants React réutilisables
├── configs/         # Fichiers de configuration (JSON)
├── database/        # Opérations IndexedDB
├── hooks/           # Hooks personnalisés
│   └── events/      # Gestionnaires d'événements Socket.IO
├── providers/       # Context providers (Theme, Socket, LocalStore)
├── redux/           # Store Redux Toolkit + slices
│   ├── app.ts       # État global (thème, langue, utilisateurs)
│   ├── user.ts      # Authentification
│   ├── data/        # Données applicatives (contacts, discussions, messages)
│   └── conference/  # État de la visioconférence
├── router/          # Configuration React Router
├── services/        # Services API (à venir)
├── types/           # Types TypeScript centralisés
├── utils/           # Fonctions utilitaires
├── views/           # Pages et vues
│   ├── home/        # Page d'accueil / connexion
│   ├── main/        # Interface principale (navigation + messagerie)
│   ├── conference/  # Visioconférence (setup, meeting, end)
│   └── cover/       # Écran de chargement
├── App.tsx          # Composant racine
└── main.tsx         # Point d'entrée
```

### Import aliases

Le projet utilise `@/` comme alias pour `src/` :

```typescript
import { RootState } from "@/redux/store";
import useTheme from "@/hooks/useTheme";
```

---

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/vic-mtf/lisolona-budget.git
cd lisolona-budget

# Installer les dépendances (pnpm uniquement)
pnpm install

# Lancer le serveur de développement
pnpm dev
```

L'application est accessible sur [https://localhost:3000](https://localhost:3000) (HTTPS via mkcert).

---

## Scripts

| Commande | Description |
|---|---|
| `pnpm dev` | Serveur de développement (port 3000, HTTPS) |
| `pnpm build` | Vérification TypeScript + build Vite |
| `pnpm build:only` | Build Vite sans vérification TypeScript |
| `pnpm typecheck` | Vérification TypeScript (`tsc --noEmit`) |
| `pnpm lint` | ESLint |
| `pnpm preview` | Prévisualisation du build |
| `pnpm deploy` | Build + déploiement sur le serveur |

---

## Déploiement

```bash
pnpm deploy
```

Cette commande build, compresse et envoie les fichiers sur le serveur GEID.

---

## Variables d'environnement

```env
VITE_SERVER_BASE_URL=https://geidbudget.com
VITE_RESPONSE_TYPE=json
VITE_RESPONSE_ENCODING=utf8
VITE_MAX_CONTENT_LENGTH=4000
VITE_PROXY=protocol=https
```

---

## Licence

Projet sous licence MIT.

---

## Plateforme GEID Budget

GEID Budget est une plateforme modulaire développée pour le Secrétariat Général du Budget (RDC). Elle comprend :

- **geid-archives-app** : Gestion d'archives (React + TypeScript + Vite)
- **geid-workspaces-app** : Espace de travail collaboratif (React + TypeScript + Vite)
- **GEID_Git** : Backend (Express.js + MongoDB + Socket.IO)
- **lisolona-budget** : Communication et visioconférence (React + TypeScript + Vite)
