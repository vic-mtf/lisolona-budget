import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import { useScreenTrack } from '../../../agora-actions-wrapper/hooks/useRemoteUsersTrack';
import useFitVideo from '../../../../../../hooks/useFitVideo';

const RemoteActiveView = ({ id }) => {
  const videoRef = useRef(null);
  const style = useFitVideo(videoRef);

  const screenTrack = useScreenTrack(id);

  useEffect(() => {
    const video = videoRef.current;
    if (!screenTrack || !video) return;
    const mediaStreamTrack = screenTrack.getMediaStreamTrack();
    const stream = new MediaStream([mediaStreamTrack]);
    video.srcObject = stream;
    return () => {
      video.srcObject = null;
    };
  }, [screenTrack]);

  return (
    <Box
      component={motion.div}
      key="single-view"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="video"
        disablePictureInPicture
        autoPlay
        playsInline
        ref={videoRef}
        muted
        sx={{ ...style, objectPosition: 'center' }}
      />
    </Box>
  );
};

export default React.memo(RemoteActiveView);
