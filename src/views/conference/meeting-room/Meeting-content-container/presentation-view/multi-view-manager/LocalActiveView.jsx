import React from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import LocalPresentationView from '../local-presentation-view/LocalPresentationView';

const LocalActiveView = ({ isActive }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={1}
      position="relative"
    >
      <Box
        component={motion.div}
        animate={{
          scale: isActive ? 1 : 0.8,
          opacity: isActive ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          borderRadius: 1,
          display: 'flex',
        }}
      >
        <LocalPresentationView />
      </Box>
    </Box>
  );
};

LocalActiveView.propTypes = {
  isActive: PropTypes.bool,
};

export default React.memo(LocalActiveView);
