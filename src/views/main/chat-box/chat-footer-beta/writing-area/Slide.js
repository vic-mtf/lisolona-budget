import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { styled } from '@mui/material';

const Content = styled(motion.div)(() => ({
    overflow: 'hidden',
}))

const Slide = ({open, children }) => {
  const initialRef = useRef();

  useEffect(() => {
    initialRef.current = { height: 0, opacity: 0 }
  },[]);

  return (
    <AnimatePresence>
    {open && (
        <Content
            initial={initialRef.current}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >{children}
        </Content>
    )}
    </AnimatePresence>
  );
};

export default Slide;
