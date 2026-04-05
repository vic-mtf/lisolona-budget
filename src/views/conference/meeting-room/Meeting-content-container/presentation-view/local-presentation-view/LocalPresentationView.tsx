import Box from '@mui/material/Box';
// import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';
import React, { useRef, useEffect } from 'react';
import DrawingLayer from './DrawingLayer';
import { canvasStreamComposer } from '../../../../../../utils/CanvasStreamComposer';

const LocalPresentationView = () => {
  const stageRef = useRef();
  const timer = useRef();

  useEffect(() => {
    if (!stageRef?.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      canvasStreamComposer.setStage(stageRef?.current);
    }, 300);
    return () => {
      clearTimeout(timer.current);
    };
  }, [stageRef]);

  return (
    <Box display="flex" flex={1} position="relative" width="100%">
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        <DrawingLayer stageRef={stageRef} />
      </Box>
    </Box>
  );
};

export default React.memo(LocalPresentationView);
