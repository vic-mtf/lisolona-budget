import Box from '@mui/material/Box';
import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';
import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useVisibleVideoSize from '../../../../../../hooks/useVisibleVideoSize';
import DrawingLayer from './DrawingLayer';

const LocalPresentationView = () => {
  const videoRef = useRef(null);
  const { width, height, scaleX, scaleY, offsetX, offsetY } =
    useVisibleVideoSize(videoRef);
  const [getData] = useLocalStoreData('conference.setup.devices.screen');
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );

  console.log('BONJOUR LES GENS...');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const stream = getData('stream');
    video.srcObject = null;
    video.srcObject = stream;
  }, [getData, enabled]);

  return (
    <Box display="flex" flex={1} position="relative" width="100%">
      <Box position="absolute" top={0} left={0} right={0} bottom={0}>
        <Box
          component="video"
          autoPlay
          playsInline
          ref={videoRef}
          muted
          width="100%"
          height="100%"
          sx={{
            objectFit: 'contain',
            position: 'absolute',
          }}
        />
        <DrawingLayer
          width={width}
          height={height}
          scaleX={scaleX}
          scaleY={scaleY}
          offsetX={offsetX}
          offsetY={offsetY}
        />
      </Box>
    </Box>
  );
};

export default React.memo(LocalPresentationView);
