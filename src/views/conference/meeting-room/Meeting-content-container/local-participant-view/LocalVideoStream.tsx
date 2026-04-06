import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import AudioWaveSpeaker from './AudioWaveSpeaker';
import ListAvatar from '@/components/ListAvatar';
import useLocalStoreData from '@/hooks/useLocalStoreData';
import getFullName from '@/utils/getFullName';
import streamSegmenterMediaPipe from '@/utils/StreamSegmenterMediaPipe';

const LocalVideoStream = () => {
  const [opacity, setOpacity] = useState(0);
  const videoRef = useRef();
  const isCamActive = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const id = useSelector((store) => store.user.id);
  const user = useSelector((store) => store.user);
  const name = useMemo(() => getFullName(user).charAt(0), [user]);
  const [getData] = useLocalStoreData('app.downloads.images');
  const src = useMemo(
    () => getData(user.id) || user.image,
    [getData, user.id, user.image]
  );

  useEffect(() => {
    if (!videoRef.current) return;
    const stream = streamSegmenterMediaPipe?.getProcessedStream();
    if (isCamActive) videoRef.current.srcObject = stream;
    else {
      videoRef.current.srcObject = null;
      setOpacity(0);
    }
  }, [isCamActive]);

  return (
    <>
      {!isCamActive && (
        <>
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <Box position="absolute" zIndex={1}>
              <ListAvatar id={id} src={src} sx={{ width: 50, height: 50 }}>
                {name}
              </ListAvatar>
            </Box>
            <AudioWaveSpeaker id={id} />
          </Box>
        </>
      )}
      <Box
        muted
        component="video"
        autoPlay
        playsInline
        ref={videoRef}
        disablePictureInPicture
        onLoadedMetadata={() => setOpacity(1)}
        width="100%"
        height="100%"
        sx={{
          zIndex: (t) => t.zIndex.tooltip,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          objectFit: 'cover',
          transform: 'scaleX(-1)',
          opacity,
          transition: (t) =>
            t.transitions.create('opacity', {
              easing: t.transitions.easing.easeInOut,
              duration: t.transitions.duration.enteringScreen,
            }),
        }}
      />
    </>
  );
};

export default React.memo(LocalVideoStream);
