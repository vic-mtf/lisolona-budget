import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { styled } from '@mui/material';

const Content = styled(motion.div)(() => ({
    overflow: 'hidden',
}))

const Fade = React.forwardRef (({open, children , wrapperProps}, ref) => {
  const [key, setKey] = useState(null);

  return (
    <AnimatePresence
    onExitComplete={() => setKey(Math.random())}
      key={key}
      initial={false}
    >
    {open && (
        <Content
            initial={{ opacity: 0 }}
            animate={{  opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            ref={ref}
            {...wrapperProps}
        >{children}
        </Content>
    )}
    </AnimatePresence>
  );
});

export default Fade;
