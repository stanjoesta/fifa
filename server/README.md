# FIFA Players Backend API

API REST pour la gestion des joueurs de football FIFA, construite avec Node.js, Express et MongoDB.

## 🚀 Fonctionnalités

- **CRUD complet** pour les joueurs
- **Recherche avancée** avec filtres multiples
- **Pagination** et tri
- **Statistiques** des joueurs
- **Validation** des données
- **Sécurité** (CORS, Helmet, Rate Limiting)
- **Documentation** API intégrée

## 📋 Prérequis

- Node.js (version 18+)
- MongoDB Atlas (ou MongoDB local)
- npm ou yarn

## 🛠️ Installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd fifa-players/server
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   ```bash
   cp env.example .env
   ```
   
   Modifiez le fichier `.env` avec vos configurations :
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fifa-players?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:3000
   ```

4. **Démarrer le serveur**
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## 📚 API Endpoints

### Joueurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/players` | Récupérer tous les joueurs (avec pagination et filtres) |
| GET | `/api/players/search` | Recherche avancée de joueurs |
| GET | `/api/players/stats` | Statistiques des joueurs |
| GET | `/api/players/:id` | Récupérer un joueur par ID |
| POST | `/api/players` | Créer un nouveau joueur |
| PUT | `/api/players/:id` | Mettre à jour un joueur |
| DELETE | `/api/players/:id` | Supprimer un joueur |
| POST | `/api/players/seed` | Peupler la base avec des données de test |

### Santé de l'API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérifier le statut de l'API |

## 🔍 Exemples d'utilisation

### Récupérer tous les joueurs avec pagination
```bash
GET /api/players?page=1&limit=10&sortBy=rating&sortOrder=desc
```

### Rechercher des joueurs
```bash
GET /api/players/search?q=messi&filters={"team":"Inter Miami"}
```

### Filtrer par équipe et âge
```bash
GET /api/players?team=Real Madrid&minAge=20&maxAge=30
```

### Créer un nouveau joueur
```bash
POST /api/players
Content-Type: application/json

{
  "name": "Neymar Jr",
  "team": "Al-Hilal",
  "nationality": "Brésilienne",
  "jerseyNumber": 10,
  "age": 31,
  "imageUrl": "https://example.com/neymar.jpg",
  "position": "Attaquant",
  "rating": 90,
  "marketValue": 60000000
}
```

## 🗄️ Modèle de données

```javascript
{
  name: String (requis, max 100 caractères),
  team: String (requis, max 100 caractères),
  nationality: String (requis, max 50 caractères),
  jerseyNumber: Number (requis, 1-99),
  age: Number (requis, 16-50),
  imageUrl: String (requis, URL valide),
  position: String (enum: Gardien, Défenseur, Milieu, Attaquant),
  rating: Number (1-100, défaut: 80),
  marketValue: Number (min: 0, défaut: 0),
  isActive: Boolean (défaut: true),
  createdAt: Date (automatique),
  updatedAt: Date (automatique)
}
```

## 🔒 Sécurité

- **CORS** configuré pour les domaines autorisés
- **Helmet** pour les en-têtes de sécurité
- **Rate Limiting** (100 requêtes/15min par IP)
- **Validation** des données d'entrée
- **Gestion d'erreurs** centralisée

## 🚀 Déploiement sur Azure

1. **Préparer l'application**
   ```bash
   npm run build  # Build du frontend
   ```

2. **Variables d'environnement Azure**
   - `MONGODB_URI`: Votre chaîne de connexion MongoDB Atlas
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: URL de votre app Azure

3. **Commande de démarrage Azure**
   ```
   npm run build && npm start
   ```

## 📊 Monitoring

- Logs en temps réel via Azure App Service
- Métriques de performance
- Gestion des erreurs centralisée

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
