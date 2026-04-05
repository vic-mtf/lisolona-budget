import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import React, { useMemo } from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useSmallScreen from "../hooks/useSmallScreen";
import ListAvatar from "./ListAvatar";

const MenuItems = ({
  onClose,
  contextMenu = null,
  data,
  discussionTarget,
  itemContent,
}) => {
  const notifications = useNotifications();
  const anchorPosition = useMemo(
    () =>
      contextMenu
        ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
        : undefined,
    [contextMenu]
  );
  const matches = useSmallScreen();
  const isSelected = discussionTarget?.id === data?.id;

  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const propsMenu = useMemo(
    () =>
      matches
        ? { anchor: "bottom" }
        : {
            anchorReference: "anchorPosition",
            anchorPosition,
          },
    [matches, anchorPosition]
  );

  return (
    <MenuNav
      {...propsMenu}
      open={Boolean(contextMenu)}
      onClose={onClose}
      anchorReference='anchorPosition'
      anchorPosition={anchorPosition}>
      {matches && (
        <>
          <Toolbar>
            <ListAvatar
              id={data?.id}
              src={data?.image}
              key={data?.id}
              sx={{ mr: 1 }}>
              {data?.name?.charAt(0)}
            </ListAvatar>
            <Typography
              variant='body1'
              fontWeight='bold'
              flexGrow={1}
              noWrap
              textOverflow='ellipsis'>
              {data?.name}
            </Typography>
            <IconButton onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </>
      )}
      {itemContent({ ...data, isSelected }).map(
        ({ id, label, icon, onAction, disabled }) => (
          <MenuItem
            disabled={disabled}
            onClick={() => {
              onClose();
              if (typeof onAction === "function") onAction(data, notifications);
            }}
            key={id}>
            <ListItemIcon>
              {React.createElement(
                typeof icon === "function" ? icon(data) : icon
              )}
            </ListItemIcon>
            <ListItemText
              primary={typeof label === "function" ? label(data) : label}
            />
          </MenuItem>
        )
      )}
    </MenuNav>
  );
};

export default React.memo(MenuItems);
