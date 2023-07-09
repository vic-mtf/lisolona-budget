import React from 'react';
import {  Grid } from '@mui/material';

import CarouselPub from './carousel-pub/CarouselPub';
import MainZone from './MainZone';
import Header from './Header';

function HomePage() {

  return (
      <Grid 
        container 
        spacing={4} 
        display="flex" 
        flex={1}
        overflow="auto" 
      >
        <Grid 
          item 
          xs={12} 
          md={5}
          display="flex"
          overflow="hidden"
          position="relative"
          flexDirection="column"
          sx={{
              background: theme => theme.palette.background.paper + 
              theme.customOptions.opacity,
              backdropFilter:  theme => `blur(${theme.customOptions.blur})`,
          }}
        >
          <Header />
          <MainZone/>
        </Grid>
        <Grid 
          item 
          xs={12} 
          md={7}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CarouselPub/>
        </Grid>
      </Grid>
  );
}

export default HomePage;
