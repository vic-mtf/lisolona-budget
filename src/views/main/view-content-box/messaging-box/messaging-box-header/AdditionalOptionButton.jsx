import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Zoom,
} from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";
import { createElement } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import useSmallScreen from "../../../../../hooks/useSmallScreen";
import {
  contacts,
  fullOptions,
  groupOptions,
  otherOptions,
} from "./additionalOption";

export default function AdditionalOptionButton({ type, id }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const messages = useSelector((store) => store.data.app.messages[id]);
  const matches = useSmallScreen();
  const options = useMemo(
    () => [
      ...(type === "room" ? groupOptions : contacts),
      ...(messages?.length > 0 ? [otherOptions[0]] : []),
      ...fullOptions,
    ],
    [type, messages]
  );

  return (
    <>
      <Zoom unmountOnExit appear={false} in={!matches}>
        <Tooltip title='Options supplémentaire'>
          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <MoreVertOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Zoom>
      <Menu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}>
        {options.map(({ label, id, icon = "div", action, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={(event) => {
              if (typeof action === "function") action(event);
              setAnchorEl(null);
            }}>
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

AdditionalOptionButton.propTypes = {
  type: PropTypes.oneOf(["room", "direct"]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
