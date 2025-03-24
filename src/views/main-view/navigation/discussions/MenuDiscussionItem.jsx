import { Divider, Menu, MenuItem } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";

const MenuDiscussionItem = React.memo(
  ({ onClose, contextMenu = null, data, discussionTarget }) => {
    const anchorPosition = useMemo(
      () =>
        contextMenu !== null
          ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
          : undefined,
      [contextMenu]
    );

    const isSelected = useMemo(
      () => data && discussionTarget?.id === data?.id,
      [data, discussionTarget]
    );

    return (
      <Menu
        open={Boolean(data)}
        onClose={onClose}
        anchorReference='anchorPosition'
        anchorPosition={anchorPosition}>
        <MenuItem onClick={onClose} disabled>
          Eplingler en haut
        </MenuItem>
        <MenuItem onClick={onClose}>Supprimer la discussion</MenuItem>
        {/* <MenuItem onClick={onClose}>Print</MenuItem>
        <MenuItem onClick={onClose}>Highlight</MenuItem>
        <MenuItem onClick={onClose}>Email</MenuItem> */}
        {data?.type === "room" && (
          <MenuItem onClick={onClose}>Quitter Lisanga</MenuItem>
        )}

        {isSelected && <Divider />}
        {isSelected && (
          <MenuItem onClick={onClose}>Fermer la discussions</MenuItem>
        )}
      </Menu>
    );
  }
);

MenuDiscussionItem.displayName = "MenuDiscussionItem";

MenuDiscussionItem.propTypes = {
  onClose: PropTypes.func.isRequired,
  contextMenu: PropTypes.object,
  discussionTarget: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
};

export default MenuDiscussionItem;
