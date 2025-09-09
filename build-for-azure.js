#!/usr/bin/env node

// Script de build pour Azure App Service
// Ce script construit le frontend React et le place dans le bon dossier pour Azure

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Build pour Azure App Service...\n');

try {
  // 1. Installer les dépendances du frontend
  console.log('📦 Installation des dépendances du frontend...');
  execSync('npm install', { cwd: path.join(__dirname, 'src'), stdio: 'inherit' });

  // 2. Build du frontend React
  console.log('🔨 Build du frontend React...');
  execSync('npm run build', { cwd: path.join(__dirname, 'src'), stdio: 'inherit' });

  // 3. Vérifier que le dossier build existe
  const buildPath = path.join(__dirname, 'src', 'build');
  if (!fs.existsSync(buildPath)) {
    throw new Error('Le dossier build n\'existe pas après la compilation');
  }

  // 4. Créer le dossier build à la racine pour Azure
  const azureBuildPath = path.join(__dirname, 'build');
  if (fs.existsSync(azureBuildPath)) {
    console.log('🗑️ Suppression de l\'ancien dossier build...');
    fs.rmSync(azureBuildPath, { recursive: true, force: true });
  }

  console.log('📁 Copie du build vers la racine...');
  fs.cpSync(buildPath, azureBuildPath, { recursive: true });

  // 5. Installer les dépendances du backend
  console.log('📦 Installation des dépendances du backend...');
  execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });

  // 6. Créer le package.json principal pour Azure
  console.log('📝 Création du package.json principal...');
  const mainPackageJson = {
    "name": "fifa-players-azure",
    "version": "1.0.0",
    "description": "FIFA Players MERN App for Azure",
    "main": "server/index.js",
    "type": "module",
    "scripts": {
      "start": "node server/index.js",
      "build": "node build-for-azure.js"
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
  };

  fs.writeFileSync(
    path.join(__dirname, 'package-azure.json'),
    JSON.stringify(mainPackageJson, null, 2)
  );

  console.log('\n✅ Build terminé avec succès!');
  console.log('\n📁 Structure pour Azure:');
  console.log('├── build/              # Frontend React');
  console.log('├── server/             # Backend Node.js');
  console.log('├── package-azure.json  # Package.json pour Azure');
  console.log('└── web.config         # Configuration IIS');

  console.log('\n🚀 Pour déployer sur Azure:');
  console.log('1. Renommez package-azure.json en package.json');
  console.log('2. Compressez tout le contenu dans un ZIP');
  console.log('3. Déployez via Azure Portal');

} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

