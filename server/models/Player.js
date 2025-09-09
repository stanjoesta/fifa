import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du joueur est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  team: {
    type: String,
    required: [true, 'L\'équipe est requise'],
    trim: true,
    maxlength: [100, 'Le nom de l\'équipe ne peut pas dépasser 100 caractères']
  },
  nationality: {
    type: String,
    required: [true, 'La nationalité est requise'],
    trim: true,
    maxlength: [50, 'La nationalité ne peut pas dépasser 50 caractères']
  },
  jerseyNumber: {
    type: Number,
    required: [true, 'Le numéro de maillot est requis'],
    min: [1, 'Le numéro de maillot doit être supérieur à 0'],
    max: [99, 'Le numéro de maillot ne peut pas dépasser 99']
  },
  age: {
    type: Number,
    required: [true, 'L\'âge est requis'],
    min: [16, 'L\'âge minimum est de 16 ans'],
    max: [50, 'L\'âge maximum est de 50 ans']
  },
  imageUrl: {
    type: String,
    required: [true, 'L\'URL de l\'image est requise'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'L\'URL de l\'image doit être valide et pointer vers une image'
    }
  },
  position: {
    type: String,
    enum: ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'],
    default: 'Attaquant'
  },
  rating: {
    type: Number,
    min: [1, 'La note minimum est 1'],
    max: [100, 'La note maximum est 100'],
    default: 80
  },
  marketValue: {
    type: Number,
    min: [0, 'La valeur marchande ne peut pas être négative'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour améliorer les performances de recherche
playerSchema.index({ name: 'text', team: 'text', nationality: 'text' });
playerSchema.index({ team: 1 });
playerSchema.index({ nationality: 1 });
playerSchema.index({ age: 1 });
playerSchema.index({ rating: -1 });

// Virtual pour l'âge en années
playerSchema.virtual('ageInYears').get(function() {
  return this.age;
});

// Méthode statique pour rechercher des joueurs
playerSchema.statics.searchPlayers = function(query, filters = {}) {
  const searchQuery = {};
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  // Appliquer les filtres
  if (filters.team) {
    searchQuery.team = new RegExp(filters.team, 'i');
  }
  if (filters.nationality) {
    searchQuery.nationality = new RegExp(filters.nationality, 'i');
  }
  if (filters.minAge) {
    searchQuery.age = { $gte: filters.minAge };
  }
  if (filters.maxAge) {
    searchQuery.age = { ...searchQuery.age, $lte: filters.maxAge };
  }
  if (filters.minRating) {
    searchQuery.rating = { $gte: filters.minRating };
  }
  if (filters.position) {
    searchQuery.position = filters.position;
  }
  
  return this.find(searchQuery).sort({ rating: -1, name: 1 });
};

// Méthode d'instance pour formater les données
playerSchema.methods.toPublicJSON = function() {
  const player = this.toObject();
  delete player.__v;
  return player;
};

// Middleware pre-save pour valider l'unicité du numéro de maillot par équipe
playerSchema.pre('save', async function(next) {
  if (this.isModified('jerseyNumber') || this.isModified('team')) {
    const existingPlayer = await this.constructor.findOne({
      team: this.team,
      jerseyNumber: this.jerseyNumber,
      _id: { $ne: this._id }
    });
    
    if (existingPlayer) {
      const error = new Error(`Le numéro ${this.jerseyNumber} est déjà utilisé dans l'équipe ${this.team}`);
      error.name = 'ValidationError';
      return next(error);
    }
  }
  next();
});

const Player = mongoose.model('Player', playerSchema);

export default Player;
