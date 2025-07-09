# GEID Lisolo

**GEID Lisolo** est une application web collaborative faisant partie de la plateforme **GEID Budget**. Cette plateforme regroupe plusieurs applications conçues pour répondre à des besoins variés. GEID Lisolo se concentre sur la communication et la collaboration en équipe, permettant d’organiser des réunions en ligne comme sur Slack ou Google Meet, mais avec des fonctionnalités enrichies et un design personnalisé.

---

## Fonctionnalités principales

- **Réunions en ligne** : planification, organisation et participation à des réunions en direct.
- **Communication en temps réel** : chat intégré, appels audio/vidéo, partages de fichiers.
- **Intégration collaborative** : tableaux de bord d’équipe, gestion de tâches, documentation partagée.
- **Interface intuitive** : navigation fluide avec une expérience utilisateur moderne.
- **Sécurité** : gestion des accès et authentification.

---

## Structure du projet

L’architecture du projet est soigneusement organisée pour une meilleure maintenabilité :

- `public/` : ressources statiques (HTML, images).
- `src/` : dossier principal du code source.
  - `assets/` : fichiers média et ressources.
  - `components/` : composants réutilisables React.
  - `configs/` : fichiers de configuration.
  - `database/` : gestion de la base de données.
  - `hooks/` : hooks personnalisés.
  - `icons/`, `svg/` : fichiers graphiques.
  - `redux/` : gestion d’état globale avec Redux.
  - `router/` : configuration du routage.
  - `styles/` : fichiers CSS et thèmes.
  - `test/` : tests unitaires et d’intégration.
  - `utils/` : fonctions utilitaires.
  - `views/` : différentes pages de l’application.
- Fichiers de configuration :
  - `App.jsx`, `main.jsx` : composants principaux et point d’entrée.
  - `.env`, `.gitignore`, `eslint.config.js`, `vite.config.js` : environnement et configurations.
  - `package.json`, `pnpm-lock.yaml` : gestion des dépendances.

---

## Installation & Lancement

1. Clone du dépôt :
   ```bash
   git clone https://github.com/vic-mtf/lisolona-budget.git
   ```
2. Accès au dossier :
   ```bash
   cd lisolona-budget
   ```
3. Installation des dépendances :
   ```bash
   pnpm install
   ```
4. Lancement du serveur local :
   ```bash
   pnpm run dev
   ```
5. Accès à l’application :
   - [GEID Lisolo v2](https://geidbudget.com/apps/lisolo/dev/v2/)

---

## Licence

Projet sous licence MIT. Voir le fichier `LICENSE` pour plus d’informations.

---

## À propos de GEID Budget

GEID Budget est une plateforme modulaire qui centralise plusieurs outils numériques pour la gestion et la collaboration. GEID Lisolo en est un module centré sur la communication en équipe.
