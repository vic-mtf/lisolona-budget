import React, { useState, useRef, useMemo, useEffect } from "react";
import SplitButton from "../SplitButton";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  ListItem,
  Divider,
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import useLocalStoreData from "../../../../../hooks/useLocalStoreData";
import { updateConferenceData } from "../../../../../redux/conference/conference";
import { stopStream } from "../../../../../utils/getDevices";
import { useCallback } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";

const CameraButton = () => {
  const [getData, setData] = useLocalStoreData("conference.setup.devices");
  const notifications = useNotifications();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef(null);
  const permission = useSelector(
    (state) => state.conference.setup.devices.camera.permission
  );
  const deviceId = useSelector(
    (state) => state.conference.setup.devices.camera.deviceId
  );
  const cameras = useSelector(
    (state) => state.conference.setup.devices.cameras
  );

  const enabled = useSelector(
    (state) => state.conference.setup.devices.camera.enabled
  );

  const getStream = useCallback(() => {
    const keys = ["camera.stream", "microphoneAndCamera.stream"];
    for (let i = 0; i < keys.length; i++)
      if (getData(keys[i])) return getData(keys[i]);
    return null;
  }, [getData]);

  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const handleChangeCamera = useCallback(
    async (device) => {
      const stream = getStream();
      if (device.deviceId !== deviceId) {
        stopStream(stream, "video");
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: device.deviceId } },
          });
          setData("camera", { stream: newStream });
        } catch (error) {
          console.error(error);
          notifications.show(`Caméra "${device.label}" n'est pas disponible`, {
            severity: "error",
          });
        }
      }
      const key = [
        "setup.devices.camera.deviceId",
        "setup.devices.camera.enabled",
        "setup.devices.camera.label",
      ];
      const data = [device.deviceId, true, device?.label];
      dispatch(updateConferenceData({ key, data }));
      setOpen(false);
    },
    [getStream, setData, dispatch, deviceId, notifications]
  );

  useEffect(() => {
    const stream = getStream();
    if (!stream) return;
    const [videoTrack] = stream.getVideoTracks();
    if (videoTrack && videoTrack.enabled !== enabled)
      videoTrack.enabled = enabled;
  }, [enabled, getStream]);

  return (
    <>
      <SplitButton
        icon={<VideocamOffOutlinedIcon />}
        activeIcon={<VideocamOutlinedIcon />}
        active={enabled}
        disabled={permission === "denied"}
        error={permission !== "granted"}
        disabledMoreButton={cameras.length === 0}
        onClick={() => {
          const stream = getStream();
          if (stream) {
            const key = "setup.devices.camera.enabled";
            dispatch(updateConferenceData({ key, data: !enabled }));
          } else {
            dispatch(
              updateConferenceData({
                key: [
                  "setup.devices.alertPermission.open",
                  "setup.devices.alertPermission.deviceType",
                ],
                data: [true, "camera"],
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
            <ListItem>
              <ListItemIcon>
                <VideocamOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Caméras' />
            </ListItem>
            <Divider />
          </>
        )}
        {cameras.map((camera) => (
          <MenuItem
            key={camera.deviceId}
            onClick={() => handleChangeCamera(camera)}>
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
