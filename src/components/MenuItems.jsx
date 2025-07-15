import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNotifications } from "@toolpad/core/useNotifications";

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

  const isSelected = discussionTarget?.id === data?.id;

  return (
    <Menu
      open={Boolean(contextMenu)}
      onClose={onClose}
      anchorReference='anchorPosition'
      anchorPosition={anchorPosition}>
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
    </Menu>
  );
};

MenuItems.propTypes = {
  onClose: PropTypes.func.isRequired,
  contextMenu: PropTypes.object,
  discussionTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
  itemContent: PropTypes.func.isRequired,
};

export default React.memo(MenuItems);
