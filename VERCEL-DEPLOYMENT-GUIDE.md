# 🚀 Guide de Déploiement Vercel - FIFA Players MERN

## 📋 Prérequis
- ✅ Application MERN développée et testée localement
- ✅ Compte Vercel (gratuit) - [vercel.com](https://vercel.com)
- ✅ MongoDB Atlas configuré
- ✅ Node.js 18+ installé
- ✅ Git configuré

## 🔧 Étape 1: Préparation de l'application

### 1.1 Structure du projet
```
fifa-players/
├── build/                 # Frontend React (généré)
├── server/               # Backend Node.js
│   ├── index.js
│   ├── package.json
│   ├── vercel.json
│   └── ...
├── vercel.json           # Configuration Vercel racine
├── package.json
└── ...
```

### 1.2 Tester localement
```bash
# Installer les dépendances
npm install

# Build du frontend
npm run build

# Tester le backend
cd server
npm install
npm start
```

## 🌐 Étape 2: Configuration MongoDB Atlas

### 2.1 Créer un cluster
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur avec mot de passe
4. Notez votre chaîne de connexion

### 2.2 Autoriser les IPs
1. Dans "Network Access", ajoutez `0.0.0.0/0` (toutes les IPs)
2. Dans "Database Access", créez un utilisateur avec droits de lecture/écriture

## 🏗️ Étape 3: Configuration Vercel

### 3.1 Créer un compte Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub, GitLab ou Bitbucket
3. Importez votre projet

### 3.2 Configuration automatique
Vercel détectera automatiquement :
- ✅ Frontend React (dossier `build`)
- ✅ Backend Node.js (dossier `server`)

## 📦 Étape 4: Déploiement

### 4.1 Méthode 1: Interface Vercel
1. Connectez votre repository Git à Vercel
2. Vercel détectera automatiquement la configuration
3. Configurez les variables d'environnement
4. Déployez !

### 4.2 Méthode 2: CLI Vercel
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Déployer en production
vercel --prod
```

## ⚙️ Étape 5: Variables d'environnement

### 5.1 Dans Vercel Dashboard
1. Allez dans votre projet → Settings → Environment Variables
2. Ajoutez ces variables :

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fifa-players?retryWrites=true&w=majority
NODE_ENV=production
FRONTEND_URL=https://votre-app.vercel.app
```

### 5.2 Variables par environnement
- **Production** : `NODE_ENV=production`
- **Preview** : `NODE_ENV=development`
- **Development** : `NODE_ENV=development`

## 🔧 Étape 6: Configuration avancée

### 6.1 Fichier vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

### 6.2 Configuration du serveur
Le fichier `server/vercel.json` configure le backend :
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

## ✅ Étape 7: Test du déploiement

### 7.1 URLs de test
- **Application** : `https://votre-app.vercel.app`
- **API Health** : `https://votre-app.vercel.app/api/health`
- **Joueurs** : `https://votre-app.vercel.app/api/players`

### 7.2 Peupler la base de données
```bash
POST https://votre-app.vercel.app/api/players/seed
```

## 🛠️ Dépannage

### Erreur 502 Bad Gateway
- Vérifiez que l'app écoute sur le bon port
- Vérifiez les logs dans Vercel Dashboard
- Vérifiez la configuration `vercel.json`

### Erreur de connexion MongoDB
- Vérifiez la variable `MONGODB_URI`
- Vérifiez les IPs autorisées dans MongoDB Atlas
- Vérifiez le nom d'utilisateur/mot de passe

### Frontend ne se charge pas
- Vérifiez que le dossier `build` existe
- Vérifiez la configuration des routes dans `vercel.json`
- Vérifiez que `npm run build` a été exécuté

### CORS Error
- Vérifiez la variable `FRONTEND_URL`
- Vérifiez la configuration CORS dans `server/index.js`

## 📊 Monitoring

### Logs en temps réel
- Vercel Dashboard → Functions → Logs

### Métriques
- Vercel Dashboard → Analytics

### Console de débogage
- Vercel Dashboard → Functions → Runtime Logs

## 🔒 Sécurité

### Variables d'environnement
- Ne jamais commiter les fichiers `.env`
- Utiliser Vercel Environment Variables

### MongoDB Atlas
- Restreindre les IPs autorisées après déploiement
- Utiliser des utilisateurs avec droits minimaux

### HTTPS
- Vercel force HTTPS par défaut
- Certificats SSL gérés automatiquement

## 💰 Coûts

### Plan Hobby (Gratuit)
- 100 GB bande passante/mois
- Fonctions serverless illimitées
- Déploiements illimités
- Domaine personnalisé

### Plan Pro (Payant)
- 1 TB bande passante/mois
- Fonctions serverless illimitées
- Déploiements illimités
- Support prioritaire
- ~$20/mois

## 🎯 Checklist de déploiement

- [ ] Application testée localement
- [ ] MongoDB Atlas configuré
- [ ] Build généré avec `npm run build`
- [ ] Compte Vercel créé
- [ ] Repository connecté à Vercel
- [ ] Variables d'environnement configurées
- [ ] Application déployée
- [ ] Logs vérifiés
- [ ] URLs de test fonctionnelles
- [ ] Base de données peuplée
- [ ] CORS configuré correctement

## 🆘 Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas** : [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Logs Vercel** : Vercel Dashboard → Functions → Logs

## 🚀 Avantages de Vercel vs Azure

### ✅ Vercel
- Déploiement plus simple
- Configuration automatique
- Fonctions serverless intégrées
- CDN global inclus
- Interface plus intuitive
- Gratuit pour la plupart des cas d'usage

### ✅ Azure
- Plus de contrôle
- Services plus complets
- Intégration Microsoft
- Meilleur pour les entreprises
- Plus d'options de configuration

## 📝 Scripts utiles

### deploy-vercel.bat (Windows)
```batch
@echo off
echo 🚀 Déploiement sur Vercel...
echo.

echo 📦 Build du frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build terminé
echo.

echo 🌐 Déploiement sur Vercel...
call vercel --prod
if errorlevel 1 (
    echo ❌ Erreur lors du déploiement
    pause
    exit /b 1
)

echo ✅ Déploiement terminé !
echo 🌐 Votre app est disponible sur Vercel
pause
```

### deploy-vercel.sh (Linux/Mac)
```bash
#!/bin/bash
echo "🚀 Déploiement sur Vercel..."
echo

echo "📦 Build du frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build terminé"
echo

echo "🌐 Déploiement sur Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo "✅ Déploiement terminé !"
echo "🌐 Votre app est disponible sur Vercel"
```
