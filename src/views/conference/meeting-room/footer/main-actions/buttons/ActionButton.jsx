import { alpha } from "@mui/material/styles";
import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";

const ActionButton = React.forwardRef(
  ({ children, id, title, onClick, selected }, ref) => {
    return (
      <Tooltip title={title}>
        <div ref={ref}>
          <ToggleButton
            value={id || ""}
            onClick={onClick}
            selected={selected}
            color={selected ? "primary" : "standard"}
            size='small'
            sx={{
              border: "none",
              bgcolor: (t) =>
                alpha(
                  t.palette.common[
                    t.palette.mode === "light" ? "black" : "white"
                  ],
                  0.03
                ),
            }}>
            {children}
          </ToggleButton>
        </div>
      </Tooltip>
    );
  }
);

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
};

ActionButton.displayName = "ActionButton";

export default ActionButton;
