import React, {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import SplitButton from "../SplitButton";
import { useDispatch, useSelector } from "react-redux";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import {
  Menu,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  MenuItem,
  Box,
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import useLocalStoreData from "../../../../../hooks/useLocalStoreData";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import { stopStream } from "../../../../../utils/getDevices";
import VolumeBar from "../VolumeBar";
import { noiseSuppressor } from "../../../../../utils/NoiseSuppressor";

const MicButton = () => {
  const [open, setOpen] = useState(false);
  const [getData, setData] = useLocalStoreData("conference.setup.devices");
  const dispatch = useDispatch();
  const enabled = useSelector(
    (state) => state.conference.setup.devices.microphone.enabled
  );
  const deviceId = useSelector(
    (state) => state.conference.setup.devices.microphone.deviceId
  );
  const getStream = useCallback(
    () => (deviceId ? getData("microphone.stream") : null),
    [getData, deviceId]
  );

  const anchorElRef = useRef(null);
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const microphones = useSelector(
    (state) => state.conference.setup.devices.microphones
  );

  const permission = useSelector(
    (state) => state.conference.setup.devices.microphone.permission
  );

  const handleChangeMicrophone = useCallback(
    async (device) => {
      const stream = getStream();
      if (device.deviceId === deviceId) return;
      stopStream(stream, "audio");
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: device.deviceId },
      });
      const processedStream = await noiseSuppressor.initStream(newStream);
      setData("microphone", { stream: newStream, processedStream });
      //noiseSuppressor.toggleProcessing(false);
      const key = [
        "setup.devices.microphone.deviceId",
        "setup.devices.microphone.enabled",
        "setup.devices.microphone.label",
      ];
      const data = [device.deviceId, true, device?.label];
      dispatch(updateConferenceData({ key, data }));
      setOpen(false);
    },
    [getStream, setData, dispatch, deviceId]
  );

  useEffect(() => {
    const stream = getStream();
    if (stream) {
      const [audioTrack] = stream.getAudioTracks();
      if (audioTrack && audioTrack?.enabled !== enabled)
        audioTrack.enabled = enabled;
    }
  }, [enabled, getStream]);

  return (
    <>
      {!matches && (
        <ListItem disableGutters disablePadding sx={{ maxWidth: 50 }}>
          <Box width='100%'>
            <VolumeBar deviceId={deviceId} />
          </Box>
        </ListItem>
      )}
      <SplitButton
        icon={<MicOffOutlinedIcon />}
        activeIcon={<MicNoneOutlinedIcon />}
        active={enabled}
        disabled={permission === "denied"}
        error={permission !== "granted"}
        disabledMoreButton={microphones.length === 0}
        disabledTitle={
          "Vous avez refusé l'accès au micro. Voir les paramètres de votre navigateur pour activer l'accès."
        }
        activeTitle={"Micro activé"}
        inactiveTitle={"Micro désactivé"}
        onClick={() => {
          const stream = getStream();
          if (stream) {
            const key = "setup.devices.microphone.enabled";
            dispatch(updateConferenceData({ key, data: !enabled }));
          } else {
            dispatch(
              updateConferenceData({
                key: [
                  "setup.devices.alertPermission.open",
                  "setup.devices.alertPermission.deviceType",
                ],
                data: [true, "microphone"],
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
          ? { anchor: "bottom" }
          : { anchorEl: anchorElRef.current })}>
        {matches && (
          <>
            <ListItem
              secondaryAction={
                <Box width={100}>
                  <VolumeBar deviceId={enabled && deviceId} />
                </Box>
              }>
              <ListItemIcon>
                <MicNoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Microphones' />
            </ListItem>
            <Divider />
          </>
        )}

        {microphones.map((microphone) => (
          <MenuItem
            key={microphone.deviceId}
            onClick={() => handleChangeMicrophone(microphone)}>
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
