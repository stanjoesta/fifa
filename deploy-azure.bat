@echo off
echo 🚀 Déploiement FIFA Players sur Azure...
echo.

echo 📦 Build de l'application...
call npm run build

echo.
echo 📁 Préparation pour Azure...
if exist "build" rmdir /s /q build
if exist "package-azure.json" del package-azure.json

echo Copie du build React...
xcopy "src\build" "build\" /E /I /Y

echo Création du package.json pour Azure...
echo {> package-azure.json
echo   "name": "fifa-players-azure",>> package-azure.json
echo   "version": "1.0.0",>> package-azure.json
echo   "description": "FIFA Players MERN App for Azure",>> package-azure.json
echo   "main": "server/index.js",>> package-azure.json
echo   "type": "module",>> package-azure.json
echo   "scripts": {>> package-azure.json
echo     "start": "node server/index.js">> package-azure.json
echo   },>> package-azure.json
echo   "engines": {>> package-azure.json
echo     "node": ">=18.0.0">> package-azure.json
echo   },>> package-azure.json
echo   "dependencies": {>> package-azure.json
echo     "express": "^4.18.2",>> package-azure.json
echo     "mongoose": "^8.0.3",>> package-azure.json
echo     "cors": "^2.8.5",>> package-azure.json
echo     "dotenv": "^16.3.1",>> package-azure.json
echo     "helmet": "^7.1.0",>> package-azure.json
echo     "express-rate-limit": "^7.1.5">> package-azure.json
echo   }>> package-azure.json
echo }>> package-azure.json

echo.
echo ✅ Préparation terminée!
echo.
echo 📁 Fichiers prêts pour Azure:
echo ├── build/              # Frontend React
echo ├── server/             # Backend Node.js  
echo ├── package-azure.json  # Package.json pour Azure
echo └── web.config         # Configuration IIS
echo.
echo 🚀 Prochaines étapes:
echo 1. Renommez package-azure.json en package.json
echo 2. Compressez tout dans un ZIP
echo 3. Déployez via Azure Portal
echo.
pause

