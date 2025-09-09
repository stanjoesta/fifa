import express from 'express';
import Player from '../models/Player.js';

const router = express.Router();

// GET /api/players - Récupérer tous les joueurs avec filtres et pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      team,
      nationality,
      minAge,
      maxAge,
      minRating,
      position,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Construction des filtres
    const filters = {};
    if (team) filters.team = team;
    if (nationality) filters.nationality = nationality;
    if (minAge) filters.minAge = parseInt(minAge);
    if (maxAge) filters.maxAge = parseInt(maxAge);
    if (minRating) filters.minRating = parseInt(minRating);
    if (position) filters.position = position;

    // Configuration du tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calcul de la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Recherche avec filtres
    let query = Player.find(filters);

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    // Exécution de la requête avec tri et pagination
    const players = await query
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Compter le total pour la pagination
    const total = await Player.countDocuments(filters);

    res.json({
      success: true,
      data: players,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPlayers: total,
        hasNext: skip + players.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des joueurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des joueurs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/players/search - Recherche avancée de joueurs
router.get('/search', async (req, res) => {
  try {
    const { q, filters = {} } = req.query;
    
    const searchFilters = JSON.parse(filters || '{}');
    const players = await Player.searchPlayers(q, searchFilters);

    res.json({
      success: true,
      data: players,
      count: players.length
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/players/stats - Statistiques des joueurs
router.get('/stats', async (req, res) => {
  try {
    const stats = await Player.aggregate([
      {
        $group: {
          _id: null,
          totalPlayers: { $sum: 1 },
          averageAge: { $avg: '$age' },
          averageRating: { $avg: '$rating' },
          minAge: { $min: '$age' },
          maxAge: { $max: '$age' },
          minRating: { $min: '$rating' },
          maxRating: { $max: '$rating' }
        }
      }
    ]);

    const teamStats = await Player.aggregate([
      {
        $group: {
          _id: '$team',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const nationalityStats = await Player.aggregate([
      {
        $group: {
          _id: '$nationality',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        general: stats[0] || {},
        topTeams: teamStats,
        topNationalities: nationalityStats
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/players/:id - Récupérer un joueur par ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).select('-__v');
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    res.json({
      success: true,
      data: player
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du joueur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du joueur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/players - Créer un nouveau joueur
router.post('/', async (req, res) => {
  try {
    const playerData = req.body;
    
    // Validation des données requises
    const requiredFields = ['name', 'team', 'nationality', 'jerseyNumber', 'age', 'imageUrl'];
    const missingFields = requiredFields.filter(field => !playerData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Champs requis manquants',
        missingFields
      });
    }

    const player = new Player(playerData);
    await player.save();

    res.status(201).json({
      success: true,
      message: 'Joueur créé avec succès',
      data: player
    });
  } catch (error) {
    console.error('Erreur lors de la création du joueur:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du joueur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/players/:id - Mettre à jour un joueur
router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Joueur mis à jour avec succès',
      data: player
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du joueur:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du joueur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/players/:id - Supprimer un joueur
router.delete('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Joueur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Joueur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du joueur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du joueur',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/players/seed - Peupler la base de données avec des données de test
router.post('/seed', async (req, res) => {
  try {
    // Vérifier si des joueurs existent déjà
    const existingPlayers = await Player.countDocuments();
    if (existingPlayers > 0) {
      return res.status(400).json({
        success: false,
        message: 'La base de données contient déjà des joueurs'
      });
    }

    const samplePlayers = [
      {
        name: "Lionel Messi",
        team: "Inter Miami",
        nationality: "Argentine",
        jerseyNumber: 10,
        age: 36,
        imageUrl: "https://img.a.transfermarkt.technology/portrait/big/28003-1671435885.jpg",
        position: "Attaquant",
        rating: 95,
        marketValue: 50000000
      },
      {
        name: "Kylian Mbappé",
        team: "Real Madrid",
        nationality: "Française",
        jerseyNumber: 7,
        age: 24,
        imageUrl: "https://tse4.mm.bing.net/th/id/OIP.DPbxW71snkMxwDVR2cdg0AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
        position: "Attaquant",
        rating: 92,
        marketValue: 180000000
      },
      {
        name: "Erling Haaland",
        team: "Manchester City",
        nationality: "Norvégienne",
        jerseyNumber: 9,
        age: 23,
        imageUrl: "https://foot11.com/wp-content/uploads/2022/08/Haaland-2.jpg",
        position: "Attaquant",
        rating: 91,
        marketValue: 150000000
      },
      {
        name: "Sadio Mane",
        team: "Bayern Munich",
        nationality: "Sénégalais",
        jerseyNumber: 10,
        age: 32,
        imageUrl: "https://tse1.mm.bing.net/th/id/OIP.R6OrE9ehsjZqtQrIU0l8mQHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
        position: "Attaquant",
        rating: 88,
        marketValue: 30000000
      },
      {
        name: "Robert Lewandowski",
        team: "Barcelona",
        nationality: "Polonais",
        jerseyNumber: 9,
        age: 34,
        imageUrl: "https://th.bing.com/th/id/OIP.KvnZQy9Gneq7dTsKaDT12wHaE8?w=248&h=180&c=7&r=0&o=7&dpr=1.4&pid=1.7&rm=3",
        position: "Attaquant",
        rating: 89,
        marketValue: 25000000
      }
    ];

    const createdPlayers = await Player.insertMany(samplePlayers);

    res.status(201).json({
      success: true,
      message: `${createdPlayers.length} joueurs créés avec succès`,
      data: createdPlayers
    });
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du peuplement de la base de données',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
