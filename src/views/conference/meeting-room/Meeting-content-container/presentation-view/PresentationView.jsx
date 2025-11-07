import Box from '@mui/material/Box';
import React from 'react';
import MultiViewManager from './multi-view-manager/MultiViewManager';
import Header from './header/Header';

const PresentationView = React.forwardRef((_, ref) => {
  return (
    <Box
      width={'100%'}
      height={'100%'}
      ref={ref}
      display="flex"
      flexDirection="column"
    >
      <Header />
      <MultiViewManager />
    </Box>
  );
});
PresentationView.displayName = 'PresentationView';
export default React.memo(PresentationView);
