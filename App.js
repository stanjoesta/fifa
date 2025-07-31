import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayersList from './components/PlayersList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header style={{
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '20px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1>FIFA Star Player 2025</h1>
        <p>Découvrez les meilleurs joueurs du moment</p>
      </header>
      <PlayersList />
      <footer style={{
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '10px',
        marginTop: '30px'
      }}>
        © 2025 FIFA Player Cards - Tous droits réservés
        <p>Les images sont utilisées à des fins éducatives uniquement</p>
        <p>Source des données: <a href="https://www.transfermarkt.fr/" target="_blank" rel="noopener noreferrer">Transfermarkt</a></p>
      </footer>
    </div>
  );
}

export default App;