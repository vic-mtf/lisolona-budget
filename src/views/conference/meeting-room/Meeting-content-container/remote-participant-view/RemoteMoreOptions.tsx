import React from "react";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useEffect } from "react";
import { useCallback } from "react";

const RemoteMoreOptions = ({ containerRef }) => {
  const [contextMenu, setContextMenu] = React.useState(null);

  const handleContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      if (event.target !== containerRef?.current) return;
      setContextMenu(
        contextMenu === null
          ? {
              mouseX: event.clientX + 2,
              mouseY: event.clientY - 6,
            }
          : null
      );
    },
    [contextMenu, containerRef]
  );

  const handleClose = () => setContextMenu(null);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;
    container.addEventListener("contextmenu", handleContextMenu);
    container.style.cursor = "context-menu";
    return () => {
      container.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [containerRef, handleContextMenu]);

  return (
    <Menu
      open={contextMenu !== null}
      onClose={handleClose}
      anchorReference='anchorPosition'
      slotProps={{ list: { dense: true } }}
      anchorPosition={
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined
      }>
      <PinItem onClose={handleClose} />
      <BanishItem onClose={handleClose} />
    </Menu>
  );
};

const BanishItem = ({ onClose }) => {
  return (
    <ListItemButton onClick={onClose}>
      <ListItemIcon>
        <DoDisturbOnOutlinedIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText
        slotProps={{ primary: { variant: "body2" } }}
        primary='Bannir de la réunion'
      />
    </ListItemButton>
  );
};

const PinItem = ({ onClose }) => {
  return (
    <ListItemButton onClick={onClose}>
      <ListItemIcon>
        <PushPinOutlinedIcon fontSize='small' />
      </ListItemIcon>
      <ListItemText
        slotProps={{ primary: { variant: "body2" } }}
        primary='Épingler sur la présentation '
      />
    </ListItemButton>
  );
};export default React.memo(RemoteMoreOptions);
