import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';

export default function SmallViewItem({
  id,
  index,
  onClick,
  activeView,
  color,
  name,
  children,
}) {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        component={motion.div}
        key={id}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 0.95, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        whileHover={{
          scale: 1,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        sx={{
          cursor: 'pointer',
          width: 'calc(100% - 8px)',
          height: 'calc(100% - 8px)',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: activeView === index ? '3px solid white' : 'none',
          //    transition: 'box-shadow 0.3s ease',
        }}
      >
        {children}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
          }}
        />
        {activeView === index && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '50%',
              width: window.innerWidth < 640 ? '24px' : '32px',
              height: window.innerWidth < 640 ? '24px' : '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',

              color: color,
              zIndex: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            ✓
          </motion.div>
        )}
      </Box>
    </Box>
  );
}
