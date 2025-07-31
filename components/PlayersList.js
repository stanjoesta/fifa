import React, { useEffect, useState } from 'react';
import Player from './player';
import players from '../players';

function PlayersList() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Créer des étoiles pour l'arrière-plan animé
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
      delay: `${Math.random() * 5}s`
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Étoiles animées */}
      <div className="stars">
        {stars.map(star => (
          <div 
            key={star.id}
            className="star"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--duration': star.duration,
              animationDelay: star.delay
            }}
          ></div>
        ))}
      </div>
      
      {/* Titre animé */}
      <div style={{
        width: '100%',
        textAlign: 'center',
        marginBottom: '30px',
        padding: '0 20px'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          color: '#ffd700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.7)',
          marginBottom: '10px'
        }}>
          <span className="animated-text">LES STARS DU FOOTBALL MONDIAL</span>
        </h2>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          Découvrez les joueurs les plus talentueux du moment qui illuminent les terrains de football
        </p>
      </div>
      
      {/* Liste des joueurs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1600px',
        margin: '0 auto',
        zIndex: 2
      }}>
        {players.map(player => (
          <Player key={player.id} {...player} />
        ))}
      </div>
    </div>
  );
}

export default PlayersList;