import { Menu, MenuItem } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";

const MenuDiscussion = React.memo(
  ({ onClose, open, contextMenu = null, onPin, data }) => {
    const anchorPosition = useMemo(
      () =>
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined,
      [contextMenu]
    );

    return (
      <Menu
        open={open}
        onClose={onClose}
        anchorReference='anchorPosition'
        anchorPosition={anchorPosition}>
        <MenuItem onClick={onClose}>Eplingler en haut</MenuItem>
        <MenuItem onClick={onClose}>Marquer comme non lu</MenuItem>
        {/* <MenuItem onClick={onClose}>Print</MenuItem>
        <MenuItem onClick={onClose}>Highlight</MenuItem>
        <MenuItem onClick={onClose}>Email</MenuItem> */}
        {data?.type === "room" && (
          <MenuItem onClick={onClose}>Quitter Lisanga</MenuItem>
        )}

        <MenuItem onClick={onClose}>Fermer la discussions</MenuItem>
      </Menu>
    );
  }
);

MenuDiscussion.displayName = "MenuDiscussion";

MenuDiscussion.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  contextMenu: PropTypes.object,
  data: PropTypes.object,
};

export default MenuDiscussion;
