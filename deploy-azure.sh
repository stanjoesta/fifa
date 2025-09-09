#!/bin/bash

echo "🚀 Déploiement FIFA Players sur Azure..."
echo

echo "📦 Build de l'application..."
npm run build

echo
echo "📁 Préparation pour Azure..."
if [ -d "build" ]; then
    rm -rf build
fi
if [ -f "package-azure.json" ]; then
    rm package-azure.json
fi

echo "Copie du build React..."
cp -r src/build build

echo "Création du package.json pour Azure..."
cat > package-azure.json << 'EOF'
{
  "name": "fifa-players-azure",
  "version": "1.0.0",
  "description": "FIFA Players MERN App for Azure",
  "main": "server/index.js",
  "type": "module",
  "scripts": {
    "start": "node server/index.js"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5"
  }
}
EOF

echo
echo "✅ Préparation terminée!"
echo
echo "📁 Fichiers prêts pour Azure:"
echo "├── build/              # Frontend React"
echo "├── server/             # Backend Node.js"
echo "├── package-azure.json  # Package.json pour Azure"
echo "└── web.config         # Configuration IIS"
echo
echo "🚀 Prochaines étapes:"
echo "1. Renommez package-azure.json en package.json"
echo "2. Compressez tout dans un ZIP"
echo "3. Déployez via Azure Portal"
echo

