import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import SplitButton from '../SplitButton';
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { useDispatch, useSelector } from 'react-redux';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  ListItem,
  Divider,
} from '@mui/material';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import useSmallScreen from '../../../../../hooks/useSmallScreen';
import useLocalStoreData from '../../../../../hooks/useLocalStoreData';
import { updateConferenceData } from '../../../../../redux/conference/conference';
import { stopStream } from '../../../../../utils/getDevices';
import { useNotifications } from '@toolpad/core/useNotifications';
import { streamSegmenterMediaPipe } from '../../../../../utils/StreamSegmenterMediaPipe';

const CameraButton = ({ activateCam = true }) => {
  const [getData, setData] = useLocalStoreData('conference.setup.devices');
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef(null);
  const permission = useSelector(
    (store) => store.conference.setup.devices.camera.permission
  );
  const deviceId = useSelector(
    (store) => store.conference.setup.devices.camera.deviceId
  );
  const cameras = useSelector(
    (store) => store.conference.setup.devices.cameras
  );

  const enabled = useSelector(
    (store) => store.conference.setup.devices.camera.enabled
  );
  const loading = useSelector((store) => store.conference.setup.loading);

  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const handleChangeCamera = useCallback(
    async (device) => {
      const stream = getData('camera.stream');
      if (device.deviceId !== deviceId) {
        stopStream(stream, 'video');
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: device.deviceId },
              width: { max: 1280 },
              height: { max: 720 },
              frameRate: { max: 30, min: 15 },
            },
          });
          streamSegmenterMediaPipe.stop();
          const processedStream = await streamSegmenterMediaPipe.initStream(
            newStream
          );
          setData('camera', { stream: newStream, processedStream });
        } catch (error) {
          console.error(error);
          notifications.show(`Caméra "${device.label}" n'est pas disponible`, {
            severity: 'error',
          });
        }
      }
      const key = [
        'setup.devices.camera.deviceId',
        'setup.devices.camera.enabled',
        'setup.devices.camera.label',
      ];
      const data = [device.deviceId, true, device?.label];
      dispatch(updateConferenceData({ key, data }));
      setOpen(false);
    },
    [getData, setData, dispatch, deviceId, notifications]
  );

  const disabledCam = useMemo(
    () => !activateCam || loading || permission === 'denied',
    [loading, permission, activateCam]
  );

  useEffect(() => {
    const stream = getData('camera.stream');
    if (!stream) return;
    const [videoTrack] = stream.getVideoTracks();
    if (videoTrack && videoTrack.enabled !== enabled)
      videoTrack.enabled = enabled;
  }, [enabled, getData]);

  return (
    <>
      <SplitButton
        icon={<VideocamOffOutlinedIcon />}
        activeIcon={<VideocamOutlinedIcon />}
        active={enabled}
        disabled={disabledCam}
        error={permission !== 'granted'}
        disabledMoreButton={cameras.length === 0}
        disabledTitle={
          activateCam
            ? "Vous avez refusé l'accès à la caméra. Voir les paramètres de votre navigateur pour activer l'accès."
            : "Le modérateur à bloqué l'accès à la caméra."
        }
        activeTitle={'Caméra activée'}
        inactiveTitle={'Caméra désactivée'}
        onClick={() => {
          const stream = getData('camera.stream');
          if (stream) {
            const key = 'setup.devices.camera.enabled';
            dispatch(updateConferenceData({ key, data: !enabled }));
          } else {
            dispatch(
              updateConferenceData({
                key: [
                  'setup.devices.alertPermission.open',
                  'setup.devices.alertPermission.deviceType',
                ],
                data: [true, 'camera'],
              })
            );
          }
        }}
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
            <ListItem>
              <ListItemIcon>
                <VideocamOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Caméras" />
            </ListItem>
            <Divider />
          </>
        )}
        {cameras.map((camera) => (
          <MenuItem
            key={camera.deviceId}
            onClick={() => handleChangeCamera(camera)}
          >
            <ListItemIcon>
              {deviceId === camera?.deviceId ? <CheckOutlinedIcon /> : <div />}
            </ListItemIcon>
            <ListItemText primary={camera.label} />
          </MenuItem>
        ))}
      </MenuNav>
    </>
  );
};

export default React.memo(CameraButton);
