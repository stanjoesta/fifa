#!/bin/bash

echo "🚀 Déploiement FIFA Players sur Vercel..."
echo

echo "📦 Installation des dépendances..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées"
echo

echo "📦 Build du frontend React..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build terminé"
echo

echo "📦 Installation des dépendances du serveur..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances du serveur"
    exit 1
fi
cd ..

echo "✅ Dépendances du serveur installées"
echo

echo "🌐 Vérification de Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "📥 Installation de Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation de Vercel CLI"
        exit 1
    fi
fi

echo "✅ Vercel CLI prêt"
echo

echo "🔐 Connexion à Vercel..."
vercel login
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la connexion à Vercel"
    exit 1
fi

echo "✅ Connecté à Vercel"
echo

echo "🌐 Déploiement sur Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement"
    exit 1
fi

echo
echo "✅ Déploiement terminé avec succès !"
echo
echo "🌐 Votre application FIFA Players est maintenant disponible sur Vercel"
echo "📊 Consultez le dashboard Vercel pour gérer votre déploiement"
echo
echo "📋 N'oubliez pas de configurer les variables d'environnement :"
echo "   - MONGODB_URI"
echo "   - NODE_ENV=production"
echo "   - FRONTEND_URL"
echo
