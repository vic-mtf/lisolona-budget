import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import SplitButton from '../SplitButton';
import { useDispatch, useSelector } from 'react-redux';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import MicOffOutlinedIcon from '@mui/icons-material/MicOffOutlined';
import useSmallScreen from '../../../../../hooks/useSmallScreen';
import {
  Menu,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import useLocalStoreData from '../../../../../hooks/useLocalStoreData';
import { updateConferenceData } from '../../../../../redux/conference/conference';
import { stopStream } from '../../../../../utils/getDevices';
import VolumeBar from '../VolumeBar';
import { noiseSuppressor } from '../../../../../utils/NoiseSuppressor';

const MicButton = ({ activateMic = true }) => {
  const [open, setOpen] = useState(false);
  const [getData, setData] = useLocalStoreData('conference.setup.devices');
  const dispatch = useDispatch();
  const enabled = useSelector(
    (store) => store.conference.setup.devices.microphone.enabled
  );

  const deviceId = useSelector(
    (store) => store.conference.setup.devices.microphone.deviceId
  );
  const loading = useSelector((store) => store.conference.setup.loading);
  const anchorElRef = useRef(null);
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const microphones = useSelector(
    (store) => store.conference.setup.devices.microphones
  );

  const permission = useSelector(
    (store) => store.conference.setup.devices.microphone.permission
  );

  const handleChangeMicrophone = useCallback(
    async (device) => {
      const stream = getData('microphone.stream');
      if (device.deviceId === deviceId) return;
      stopStream(stream, 'audio');
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: device.deviceId },
      });
      const processedStream = await noiseSuppressor.initStream(newStream);
      setData('microphone', { stream: newStream, processedStream });
      //noiseSuppressor.toggleProcessing(false);
      const key = [
        'setup.devices.microphone.deviceId',
        'setup.devices.microphone.enabled',
        'setup.devices.microphone.label',
      ];
      const data = [device.deviceId, true, device?.label];
      dispatch(updateConferenceData({ key, data }));
      setOpen(false);
    },
    [getData, setData, dispatch, deviceId]
  );

  const onToggleMicrophone = useCallback(() => {
    const stream = getData('microphone.stream');
    if (stream) {
      const key = 'setup.devices.microphone.enabled';
      dispatch(updateConferenceData({ key, data: !enabled }));
    } else {
      dispatch(
        updateConferenceData({
          key: [
            'setup.devices.alertPermission.open',
            'setup.devices.alertPermission.deviceType',
          ],
          data: [true, 'microphone'],
        })
      );
    }
  }, [dispatch, enabled, getData]);

  const disabledMic = useMemo(
    () => !activateMic || loading || permission === 'denied',
    [activateMic, loading, permission]
  );

  useEffect(() => {
    const stream = getData('microphone.stream');
    if (stream) {
      const [audioTrack] = stream.getAudioTracks();
      if (audioTrack && audioTrack?.enabled !== enabled)
        audioTrack.enabled = enabled;
    }
  }, [enabled, getData]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === 'Space') onToggleMicrophone();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onToggleMicrophone]);

  return (
    <>
      {!matches && (
        <ListItem disableGutters disablePadding sx={{ maxWidth: 50 }}>
          <Box width="100%" component={Typography}>
            <VolumeBar enabled={enabled} />
          </Box>
        </ListItem>
      )}
      <SplitButton
        icon={<MicOffOutlinedIcon />}
        activeIcon={<MicNoneOutlinedIcon />}
        active={enabled}
        disabled={disabledMic}
        error={permission !== 'granted'}
        disabledMoreButton={microphones.length === 0}
        disabledTitle={
          activateMic
            ? "Vous avez refusé l'accès au micro. Voir les paramètres de votre navigateur pour activer l'accès."
            : 'Le modérateur a bloqué activation du micro.'
        }
        activeTitle={'Micro activé'}
        inactiveTitle={'Micro désactivé'}
        onClick={onToggleMicrophone}
        ref={anchorElRef}
        onExpand={() => setOpen((open) => !open)}
      />
      <MenuNav
        open={open}
        onClose={() => setOpen(false)}
        {...(matches
          ? { anchor: 'bottom' }
          : { anchorEl: anchorElRef.current })}
      >
        {matches && (
          <>
            <ListItem
              secondaryAction={
                <Box width={100}>
                  <VolumeBar enabled={enabled} />
                </Box>
              }
            >
              <ListItemIcon>
                <MicNoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Microphones" />
            </ListItem>
            <Divider />
          </>
        )}

        {microphones.map((microphone) => (
          <MenuItem
            key={microphone.deviceId}
            onClick={() => handleChangeMicrophone(microphone)}
          >
            <ListItemIcon>
              {microphone.deviceId === deviceId ? (
                <CheckOutlinedIcon />
              ) : (
                <div />
              )}
            </ListItemIcon>
            <ListItemText primary={microphone.label} />
          </MenuItem>
        ))}
      </MenuNav>
    </>
  );
};

export default React.memo(MicButton);
