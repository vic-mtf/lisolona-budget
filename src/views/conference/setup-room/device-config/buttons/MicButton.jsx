import React from "react";
import SplitButton from "../SplitButton";
import { useSelector } from "react-redux";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import { useState, useMemo, useRef } from "react";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import {
  Menu,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  MenuItem,
} from "@mui/material";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

const MicButton = () => {
  const [open, setOpen] = useState(false);
  const anchorElRef = useRef(null);
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const microphones = useSelector(
    (state) => state.conference.setup.devices.microphones
  );
  const deviceId = useSelector(
    (state) => state.conference.setup.devices.microphone.deviceId
  );
  const permission = useSelector(
    (state) => state.conference.setup.devices.microphone.permission
  );
  const enabled = useSelector(
    (state) => state.conference.setup.devices.microphone.enabled
  );

  return (
    <>
      <SplitButton
        icon={<MicOffOutlinedIcon />}
        activeIcon={<MicNoneOutlinedIcon />}
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
                <MicNoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary='Microphones' />
            </ListItem>
            <Divider />
          </>
        )}

        {microphones.map((microphone) => (
          <MenuItem key={microphone.deviceId}>
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
