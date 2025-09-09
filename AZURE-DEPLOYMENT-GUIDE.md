# 🚀 Guide de Déploiement Azure - FIFA Players MERN

## 📋 Prérequis
- ✅ Application MERN développée et testée localement
- ✅ Compte Microsoft Azure (gratuit)
- ✅ MongoDB Atlas configuré
- ✅ Node.js 18+ installé

## 🔧 Étape 1: Préparation de l'application

### 1.1 Tester localement
```bash
# Installer toutes les dépendances
npm run install-all

# Démarrer le backend
npm run server:dev

# Dans un autre terminal, démarrer le frontend
npm start
```

### 1.2 Vérifier la connexion MongoDB
- Testez l'API : http://localhost:5000/api/health
- Peuplez la DB : POST http://localhost:5000/api/players/seed

## 🌐 Étape 2: Configuration MongoDB Atlas

### 2.1 Créer un cluster
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un cluster gratuit (M0)
3. Créez un utilisateur avec mot de passe
4. Notez votre chaîne de connexion

### 2.2 Autoriser les IPs
1. Dans "Network Access", ajoutez :
   - Votre IP actuelle
   - `0.0.0.0/0` (temporairement pour Azure)
2. Dans "Database Access", créez un utilisateur avec droits de lecture/écriture

## 🏗️ Étape 3: Build pour Azure

### 3.1 Préparer l'application
```bash
# Windows
deploy-azure.bat

# Linux/Mac
chmod +x deploy-azure.sh
./deploy-azure.sh
```

### 3.2 Vérifier la structure
```
fifa-players/
├── build/              # Frontend React (généré)
├── server/             # Backend Node.js
├── package-azure.json  # Package.json pour Azure
└── web.config         # Configuration IIS
```

## ☁️ Étape 4: Créer Azure App Service

### 4.1 Créer l'App Service
1. Allez sur [Azure Portal](https://portal.azure.com)
2. "Créer une ressource" → "Web" → "Application web"
3. Remplissez :
   - **Nom** : `fifa-players-app` (doit être unique)
   - **Groupe de ressources** : Créer nouveau `fifa-players-rg`
   - **Région** : `France Centre` ou `West Europe`
   - **Plan** : `B1` (recommandé) ou `F1` (gratuit)
   - **Runtime** : `Node 18 LTS`

### 4.2 Configurer les variables d'environnement
1. Dans votre App Service → "Configuration"
2. Ajoutez ces variables :
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fifa-players?retryWrites=true&w=majority
   NODE_ENV=production
   PORT=8080
   FRONTEND_URL=https://fifa-players-app.azurewebsites.net
   ```

## 📦 Étape 5: Déploiement

### 5.1 Méthode 1: Déploiement ZIP
1. Renommez `package-azure.json` en `package.json`
2. Compressez tout le contenu dans un ZIP
3. Dans Azure Portal → "Centre de déploiement" → "ZIP Deploy"
4. Uploadez votre ZIP

### 5.2 Méthode 2: Git Local
1. Dans Azure Portal → "Centre de déploiement" → "Git local"
2. Suivez les instructions pour cloner le repo Git
3. Copiez vos fichiers dans le repo cloné
4. `git add . && git commit -m "Deploy" && git push`

### 5.3 Méthode 3: GitHub Actions (avancé)
1. Créez un repo GitHub
2. Poussez votre code
3. Dans Azure → "Centre de déploiement" → "GitHub"
4. Sélectionnez votre repo et branche

## 🔧 Étape 6: Configuration finale

### 6.1 Commande de démarrage
Dans Azure Portal → "Configuration" → "Général" :
```
Commande de démarrage : npm install && npm start
```

### 6.2 Vérifier les logs
1. Azure Portal → "Monitoring" → "Stream de journaux"
2. Vérifiez que l'application démarre sans erreur

## ✅ Étape 7: Test du déploiement

### 7.1 URLs de test
- **Application** : `https://fifa-players-app.azurewebsites.net`
- **API Health** : `https://fifa-players-app.azurewebsites.net/api/health`
- **Joueurs** : `https://fifa-players-app.azurewebsites.net/api/players`

### 7.2 Peupler la base de données
```bash
POST https://fifa-players-app.azurewebsites.net/api/players/seed
```

## 🛠️ Dépannage

### Erreur 502 Bad Gateway
- Vérifiez que l'app écoute sur `process.env.PORT`
- Vérifiez les logs dans Azure Portal
- Vérifiez la commande de démarrage

### Erreur de connexion MongoDB
- Vérifiez la variable `MONGODB_URI`
- Vérifiez les IPs autorisées dans MongoDB Atlas
- Vérifiez le nom d'utilisateur/mot de passe

### Frontend ne se charge pas
- Vérifiez que le dossier `build` existe
- Vérifiez le chemin dans `server/index.js`
- Vérifiez que `npm run build` a été exécuté

### CORS Error
- Vérifiez la variable `FRONTEND_URL`
- Vérifiez la configuration CORS dans `server/index.js`

## 📊 Monitoring

### Logs en temps réel
- Azure Portal → App Service → "Monitoring" → "Stream de journaux"

### Métriques
- Azure Portal → App Service → "Monitoring" → "Métriques"

### Console de débogage
- Azure Portal → App Service → "Outils avancés" → "Console de débogage"

## 🔒 Sécurité

### Variables d'environnement
- Ne jamais commiter les fichiers `.env`
- Utiliser Azure Key Vault pour les secrets (optionnel)

### MongoDB Atlas
- Restreindre les IPs autorisées après déploiement
- Utiliser des utilisateurs avec droits minimaux

### HTTPS
- Azure App Service force HTTPS par défaut
- Certificats SSL gérés automatiquement

## 💰 Coûts

### Plan F1 (Gratuit)
- 1 GB RAM
- 1 GB stockage
- Limité à 60 minutes/jour

### Plan B1 (Payant)
- 1.75 GB RAM
- 10 GB stockage
- Disponible 24/7
- ~$13/mois

## 🎯 Checklist de déploiement

- [ ] Application testée localement
- [ ] MongoDB Atlas configuré
- [ ] Build généré avec `deploy-azure.bat`
- [ ] Azure App Service créé
- [ ] Variables d'environnement configurées
- [ ] Application déployée
- [ ] Logs vérifiés
- [ ] URLs de test fonctionnelles
- [ ] Base de données peuplée
- [ ] CORS configuré correctement

## 🆘 Support

- **Documentation Azure** : [docs.microsoft.com](https://docs.microsoft.com/azure)
- **MongoDB Atlas** : [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Logs Azure** : Azure Portal → App Service → Logs

