@echo off
echo 🚀 Déploiement FIFA Players sur Vercel...
echo.

echo 📦 Installation des dépendances...
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo ✅ Dépendances installées
echo.

echo 📦 Build du frontend React...
call npm run build
if errorlevel 1 (
    echo ❌ Erreur lors du build
    pause
    exit /b 1
)

echo ✅ Build terminé
echo.

echo 📦 Installation des dépendances du serveur...
cd server
call npm install
if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances du serveur
    pause
    exit /b 1
)
cd ..

echo ✅ Dépendances du serveur installées
echo.

echo 🌐 Vérification de Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installation de Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ❌ Erreur lors de l'installation de Vercel CLI
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI prêt
echo.

echo 🔐 Connexion à Vercel...
vercel login
if errorlevel 1 (
    echo ❌ Erreur lors de la connexion à Vercel
    pause
    exit /b 1
)

echo ✅ Connecté à Vercel
echo.

echo 🌐 Déploiement sur Vercel...
vercel --prod
if errorlevel 1 (
    echo ❌ Erreur lors du déploiement
    pause
    exit /b 1
)

echo.
echo ✅ Déploiement terminé avec succès !
echo.
echo 🌐 Votre application FIFA Players est maintenant disponible sur Vercel
echo 📊 Consultez le dashboard Vercel pour gérer votre déploiement
echo.
echo 📋 N'oubliez pas de configurer les variables d'environnement :
echo    - MONGODB_URI
echo    - NODE_ENV=production
echo    - FRONTEND_URL
echo.
pause
