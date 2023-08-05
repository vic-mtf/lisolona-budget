import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const zoomInAnimation = {
  transform: 'scale(1)',
};

const zoomOutAnimation = {
  transform: 'scale(0)',
};

export default function CustomZoom ({ show, ...otherPros }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="zoomOut"
          animate="zoomIn"
          exit="zoomOut"
          variants={{
            zoomIn: { ...zoomInAnimation },
            zoomOut: { ...zoomOutAnimation },
          }}
          transition={{ duration: 0.2 }}
          { ...otherPros }
        />
      )}
    </AnimatePresence>
  );
};
