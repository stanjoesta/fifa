import React from 'react';
import { Card, Button } from 'react-bootstrap';

function Player({
  name = "Joueur inconnu",
  team = "Équipe inconnue",
  nationality = "Nationalité inconnue",
  jerseyNumber = 0,
  age = 0,
  imageUrl = "https://via.placeholder.com/150"
}) {
  return (
    <Card style={{ 
      width: '18rem', 
      margin: '20px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s'
    }} className="player-card">
      <Card.Img 
        variant="top" 
        src={imageUrl} 
        style={{ height: '250px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title style={{ color: '#1a1a1a', fontWeight: 'bold' }}>{name}</Card.Title>
        <Card.Text>
          <div style={{ marginBottom: '8px' }}>
            <strong>Équipe:</strong> {team}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Nationalité:</strong> {nationality}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Numéro:</strong> {jerseyNumber}
          </div>
          <div>
            <strong>Âge:</strong> {age}
          </div>
        </Card.Text>
        <Button 
          variant="primary" 
          style={{ 
            backgroundColor: '#0066cc',
            border: 'none',
            width: '100%'
          }}
        >
          Voir statistiques
        </Button>
      </Card.Body>
    </Card>
  );
}

export default Player;