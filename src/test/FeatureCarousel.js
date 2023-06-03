import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const features = [
  {
    image: 'https://picsum.photos/400/200',
    title: 'Partage d\'écran',
    description: 'Partagez votre écran avec les participants de la réunion pour une collaboration plus facile.',
  },
  {
    image: 'https://picsum.photos/400/200',
    title: 'Chat en direct',
    description: 'Discutez avec les participants de la réunion en utilisant la fonction de chat en direct.',
  },
  {
    image: 'https://picsum.photos/400/200',
    title: 'Appels vidéo HD',
    description: 'Profitez d\'appels vidéo de haute qualité avec une résolution allant jusqu\'à 1080p.',
  },
];

function FeatureCarousel() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mx: 5,
        flex: 2,
        bgcolor: '#ffffff', // Couleur de fond de la zone de droite
      }}
    >
      <Carousel
        autoPlay={true}
        animation="slide"
        navButtonsAlwaysVisible={true}
        cycleNavigation={true}
        indicators={false}
        sx={{
          width: '100%',
          height: 400,
        }}
      >
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardMedia
              component="img"
              image={feature.image}
              alt={feature.title}
              sx={{
                height: 200,
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Carousel>
    </Box>
  );
}

export default FeatureCarousel;
