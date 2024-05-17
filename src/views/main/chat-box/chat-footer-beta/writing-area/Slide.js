import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { styled } from '@mui/material';

const Content = styled(motion.div)(() => ({
    overflow: 'hidden',
}))

const Slide = React.forwardRef (({open, children, wrapperProps}, ref) => {
  const [key, setKey] = useState(null);

  return (
    <AnimatePresence
      onExitComplete={() => setKey(Math.random())}
      key={key}
      initial={false}
    >
    {open && (
        <Content
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            key="emoji"
            transition={{ duration: 0.2 }}
            ref={ref}
            {...wrapperProps}
        >
          {children}
        </Content>
    )}
    </AnimatePresence>
  );
});

export default Slide;
