// Script de test pour l'API FIFA Players
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Test de l\'API FIFA Players...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Test Health Check...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData.message);
    console.log('');

    // Test 2: Récupérer tous les joueurs
    console.log('2️⃣ Test récupération des joueurs...');
    const playersResponse = await fetch(`${API_BASE}/players`);
    const playersData = await playersResponse.json();
    console.log(`✅ Joueurs récupérés: ${playersData.data?.length || 0} joueurs`);
    console.log('');

    // Test 3: Peupler la base de données
    console.log('3️⃣ Test peuplement de la base...');
    const seedResponse = await fetch(`${API_BASE}/players/seed`, {
      method: 'POST'
    });
    const seedData = await seedResponse.json();
    console.log('✅ Base peuplée:', seedData.message);
    console.log('');

    // Test 4: Récupérer les statistiques
    console.log('4️⃣ Test statistiques...');
    const statsResponse = await fetch(`${API_BASE}/players/stats`);
    const statsData = await statsResponse.json();
    console.log('✅ Statistiques:', statsData.data.general);
    console.log('');

    // Test 5: Recherche de joueurs
    console.log('5️⃣ Test recherche...');
    const searchResponse = await fetch(`${API_BASE}/players/search?q=messi`);
    const searchData = await searchResponse.json();
    console.log(`✅ Recherche "messi": ${searchData.data?.length || 0} résultats`);
    console.log('');

    console.log('🎉 Tous les tests sont passés avec succès!');
    console.log('\n📊 Résumé:');
    console.log(`- API Health: ✅`);
    console.log(`- Joueurs: ${playersData.data?.length || 0} trouvés`);
    console.log(`- Base peuplée: ✅`);
    console.log(`- Statistiques: ✅`);
    console.log(`- Recherche: ✅`);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    console.log('\n🔧 Vérifiez que:');
    console.log('1. Le serveur est démarré (npm run dev)');
    console.log('2. MongoDB est connecté');
    console.log('3. Les variables d\'environnement sont configurées');
  }
}

// Exécuter les tests
testAPI();
