import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import ListAvatar from '../../../../../../components/ListAvatar';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import getFullName from '../../../../../../utils/getFullName';
// import { screenShareCompositor } from '../../../../../../utils/ScreenShareCompositor';
import { canvasStreamComposer } from '../../../../../../utils/CanvasStreamComposer';

const LocalSmallViewItem = ({ onSelectView, selected }) => {
  const videoRef = useRef(null);
  const user = useSelector((store) => store.user);
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onCanvasChanged = () => {
      video.srcObject = null;
      if (enabled) video.srcObject = canvasStreamComposer.captureStream();
    };
    canvasStreamComposer.addEventListener('canvasChanged', onCanvasChanged);
    onCanvasChanged();
    return () => {
      canvasStreamComposer.removeEventListener(
        'canvasChanged',
        onCanvasChanged
      );
      video.srcObject = null;
    };
  }, [enabled]);

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
        key={user.id}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 0.95, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{
          duration: 0.4,
          delay: 0,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
        whileHover={{
          scale: 1,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSelectView(user.id)}
        sx={{
          border: (t) =>
            `2px solid ${selected ? t.palette.primary.main : 'transparent'}`,
          cursor: 'pointer',
          width: 'calc(100% - 8px)',
          height: 'calc(100% - 8px)',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box
          component="video"
          disablePictureInPicture
          ref={videoRef}
          autoPlay
          muted="muted"
          playsInline
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            py: 1,
            gap: 1,
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
              'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
          }}
        >
          <Box
            sx={{
              '& .MuiAvatar-root': {
                width: 25,
                height: 25,
                fontSize: 12,
              },
            }}
          >
            <ListAvatar id={user.id} src={user.image}>
              {getFullName(user).charAt(0)}
            </ListAvatar>
          </Box>
          <Typography
            variant="body2"
            noWrap
            maxWidth="calc(100% - 100px)"
            textOverflow="ellipsis"
          >
            {getFullName(user)}
          </Typography>
          <Typography variant="body2" component="span">
            (vous)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(LocalSmallViewItem);
