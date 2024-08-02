import React, { useState, useEffect, useReducer } from 'react';
import { Popper, alpha } from '@mui/material';
import { motion } from 'framer-motion';

const ElasticPopper = ({ open, children, ...props}) => {
  const [visible, setVisible] = useState(open);
  const [visibleMotion, setVisibleMotion] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  const variants = {
    open: { height: 240, transition: { type: 'spring', stiffness: 100 } },
    closed: { height: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  const handleAnimationComplete = () => {
    if (!open) {
      setVisible(false);
    }
  };

  useEffect(() => {
    setVisibleMotion(open ? visible : open);
  },[visible, open]);

  return (
    <Popper 
      open={visible} 
      {...props}
      sx={{
        zIndex: theme => theme.zIndex.tooltip,
      }}
    >
      <motion.div
        initial={visibleMotion ? 'open' : 'closed'}
        animate={visibleMotion ? 'open' : 'closed'}
        variants={variants}
        onAnimationComplete={handleAnimationComplete}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </Popper>
  );
};

export default ElasticPopper;
