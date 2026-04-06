import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import ListAvatar from '@/components/ListAvatar';
import useLocalStoreData from '@/hooks/useLocalStoreData';
import getFullName from '@/utils/getFullName';
import RemoteAudioWaveSpeaker from './RemoteAudioWaveSpeaker';
import Fade from '@mui/material/Fade';
import { useVideoTrack } from '@/views/conference/meeting-room/agora-actions-wrapper/hooks/useRemoteUsersTrack';
import { useEffect } from 'react';

const RemoteVideoStream = ({ id, show }) => {
  const [fit, setFit] = React.useState('cover');
  const videoRef = React.useRef(null);
  const isCamActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isCamActive
  );
  const remoteUser = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );

  const name = useMemo(() => getFullName(remoteUser).charAt(0), [remoteUser]);
  const [getData] = useLocalStoreData('app.downloads.images');

  const videoTrack = useVideoTrack(id);

  const src = useMemo(
    () => getData(id) || remoteUser?.image,
    [getData, id, remoteUser?.image]
  );

  const open = useMemo(() => show && isCamActive, [isCamActive, show]);
  useEffect(() => {
    const video = videoRef.current;
    if (!videoTrack || !show) return;
    const mediaStreamTrack = videoTrack.getMediaStreamTrack();
    const stream = new MediaStream([mediaStreamTrack]);
    video.srcObject = stream;
    return () => {
      video.srcObject = null;
    };
  }, [videoTrack, show]);

  return (
    <>
      <Fade
        in={!open}
        appear={false}
        unmountOnExit
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
          display="flex"
          zIndex={1}
        >
          <Box position="absolute" zIndex={1}>
            <ListAvatar id={id} src={src} sx={{ width: 50, height: 50 }}>
              {name}
            </ListAvatar>
          </Box>
          <RemoteAudioWaveSpeaker id={id} />
        </Box>
      </Fade>
      <Fade
        in={open}
        appear={false}
        unmountOnExit
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent="center"
          alignItems="center"
          display="flex"
          zIndex={1}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              '& video': {
                width: '100%',
                height: '100%',
                position: 'absolute',
              },
            }}
          >
            <Box
              position="absolute"
              component="video"
              disablePictureInPicture
              ref={videoRef}
              onLoadedMetadata={(e) => {
                const video = e.target;
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
                const aspectRatio = videoWidth / videoHeight;
                setFit(aspectRatio > 1 ? 'cover' : 'contain');
              }}
              sx={{
                objectFit: fit,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'black',
              }}
              autoPlay
              muted
              playsInline
            />
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default React.memo(RemoteVideoStream);
