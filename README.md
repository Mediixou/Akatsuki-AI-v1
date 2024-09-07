# Akatsuki-AI-v1

Akatsuki-AI-v1 est un bot alimenté par Node.js avec intégration à Discord.

## Configuration

1. **Configurer le Token** :
   - Ouvrez le fichier `index.js`.
   - À la **ligne 16**, ajoutez le token de votre bot.
   - Assurez-vous également que tous les **intents** nécessaires pour le fonctionnement de votre bot sont activés dans le **portail des développeurs** de Discord.


## Installation

1. **Installer les dépendances** :
   - Exécutez la commande suivante pour installer les modules Node.js requis :
     ```bash
     npm install
     ```

## Lancer le bot

1. **Démarrer le bot** :
   - Utilisez la commande suivante pour démarrer le bot :
     ```bash
     node .
     ```

2. **Utiliser `pm2` pour exécuter le bot en arrière-plan** (optionnel) :
   - Si vous voulez que le bot s'exécute en continu en arrière-plan, vous pouvez utiliser [PM2](https://pm2.keymetrics.io/). Installez-le globalement avec :
     ```bash
     npm install -g pm2
     ```
   - Démarrez le bot avec PM2 :
     ```bash
     pm2 start index.js --name "Akatsuki-AI-v1"
     ```
   - Pour surveiller le bot :
     ```bash
     pm2 logs Akatsuki-AI-v1
     ```

## Prérequis

- **Node.js** : Assurez-vous que Node.js est installé sur votre système. Vous pouvez vérifier votre version de Node.js avec :
  ```bash
  node -v
  ```
