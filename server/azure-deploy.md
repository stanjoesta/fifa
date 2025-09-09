# Guide de déploiement Azure pour FIFA Players

## 🚀 Déploiement sur Azure App Service

### 1. Préparation de l'application

#### Structure recommandée pour Azure :
```
fifa-players/
├── server/                 # Backend Node.js/Express
│   ├── index.js
│   ├── package.json
│   ├── models/
│   ├── routes/
│   └── .env
├── src/                   # Frontend React (build)
│   ├── build/            # Dossier généré par npm run build
│   └── ...
└── package.json          # Package.json principal
```

### 2. Configuration Azure App Service

#### Variables d'environnement requises :
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fifa-players?retryWrites=true&w=majority
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://votre-app.azurewebsites.net
```

#### Commande de démarrage Azure :
```
npm run build && npm start
```

### 3. Scripts de déploiement

#### package.json principal (racine) :
```json
{
  "scripts": {
    "build": "cd src && npm run build",
    "start": "cd server && npm start",
    "dev": "concurrently \"cd server && npm run dev\" \"cd src && npm start\"",
    "install-all": "npm install && cd server && npm install && cd ../src && npm install"
  }
}
```

### 4. Workflow GitHub Actions (optionnel)

Créer `.github/workflows/azure-deploy.yml` :
```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: |
        npm install
        cd server && npm install
        cd ../src && npm install
    
    - name: Build React app
      run: cd src && npm run build
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'votre-app-name'
        publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE }}
        package: .
```

### 5. Configuration MongoDB Atlas

1. **Créer un cluster** sur MongoDB Atlas
2. **Créer un utilisateur** avec droits de lecture/écriture
3. **Autoriser les IPs** :
   - Ajouter l'IP sortante d'Azure App Service
   - Ou temporairement 0.0.0.0/0 pour les tests
4. **Récupérer la chaîne de connexion** SRV

### 6. Test du déploiement

#### URLs de test :
- **API Health** : `https://votre-app.azurewebsites.net/api/health`
- **Joueurs** : `https://votre-app.azurewebsites.net/api/players`
- **Frontend** : `https://votre-app.azurewebsites.net/`

#### Peupler la base de données :
```bash
POST https://votre-app.azurewebsites.net/api/players/seed
```

### 7. Monitoring et logs

- **Logs en temps réel** : Azure Portal → App Service → Monitoring → Log stream
- **Métriques** : Azure Portal → App Service → Monitoring → Métriques
- **Console Kudu** : Azure Portal → App Service → Outils avancés → Console de débogage

### 8. Dépannage courant

#### Erreur 502 Bad Gateway :
- Vérifier que l'app écoute sur `process.env.PORT`
- Vérifier les logs dans Azure Portal

#### Erreur de connexion MongoDB :
- Vérifier la variable `MONGODB_URI`
- Vérifier les IPs autorisées dans MongoDB Atlas

#### Frontend ne se charge pas :
- Vérifier que `npm run build` a été exécuté
- Vérifier le chemin vers le dossier `build` dans `index.js`

### 9. Optimisations de production

#### Performance :
- Activer la compression gzip
- Configurer un CDN pour les images
- Utiliser Redis pour le cache (optionnel)

#### Sécurité :
- Configurer HTTPS uniquement
- Limiter les IPs autorisées MongoDB
- Utiliser des secrets Azure Key Vault
