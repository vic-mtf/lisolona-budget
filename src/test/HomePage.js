import React from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';
import FeatureCarousel from './FeatureCarousel';

function HomePage() {
  const messages = [
    'Rejoignez vos collègues pour une réunion rapide',
    'Discutez avec vos amis et votre famille',
    'Organisez une réunion pour votre équipe',
    'Connectez-vous avec des personnes du monde entier',
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          mx: 5,
          flex: 1,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            p: 4,
            borderRadius: 4,
            bgcolor: '#f2f2f2', // Couleur de fond de la zone de gauche
          }}
        >
          <Box
            sx={{
              mb: 4,
            }}
          >
            <img
              src="https://i.imgur.com/2x6jK5E.png"
              alt="Meet Logo"
              sx={{
                width: 200,
              }}
            />
          </Box>
          <Box
            sx={{
              mb: 2,
              width: '100%',
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {randomMessage}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejoignez une réunion avec un code de réunion à 10 chiffres.
            </Typography>
          </Box>
          <Box
            sx={{
              width: '100%',
              mb: 2,
            }}
          >
            <TextField label="Code de réunion" variant="outlined" sx={{ width: '100%' }} />
          </Box>
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Button variant="outlined" color="primary" sx={{ width: '100%' }}>
              Connexion
            </Button>
          </Box>
        </Paper>
        <Box
          sx={{
            mt: 4,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Vous n'avez pas de code de réunion ? Créez-en un.
          </Typography>
        </Box>
      </Box>
      <FeatureCarousel />
    </Box>
  );
}

export default HomePage;
