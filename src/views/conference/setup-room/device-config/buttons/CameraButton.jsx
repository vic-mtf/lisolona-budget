import React, { useState, useRef, useMemo } from "react";
import SplitButton from "../SplitButton";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { useSelector } from "react-redux";
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

const CameraButton = () => {
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
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);

  return (
    <>
      <SplitButton
        icon={<VideocamOffOutlinedIcon />}
        activeIcon={<VideocamOutlinedIcon />}
        active={enabled}
        disabled={permission !== "granted"}
        error={permission === "denied"}
        onClick={() => null}
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
          <MenuItem key={camera.deviceId}>
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
