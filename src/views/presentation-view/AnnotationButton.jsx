import React, { useState, useRef } from "react";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Fab, Stack, ToggleButton, Tooltip } from "@mui/material";
import { modes } from "./modes";
import DeepMenu from "./DeepMenu";
import { useMemo } from "react";
import PropTypes from "prop-types";

const AnnotationButton = ({
  mode,
  onChange,
  active = false,
  onToggleActive,
  color,
}) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const Icon = useMemo(
    () =>
      [...modes, ...modes.map(({ children }) => children || []).flat()].find(
        ({ type, id }) => type === "mode" && id === mode
      )?.icon || "div",
    [mode]
  );

  return (
    <React.Fragment>
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        spacing={0.1}
        direction='row'>
        <Tooltip title={"annotations"} arrow>
          <Fab
            size='small'
            onClick={onToggleActive}
            color={active ? "primary" : "default"}
            // disabled={permission?.state === "denied" || loading}
            sx={{
              zIndex: 0,
              borderRadius: 1,
              boxShadow: "none",
            }}>
            <Icon size='small' />
          </Fab>
        </Tooltip>
        <ToggleButton
          value={0}
          onClick={handleToggle}
          ref={anchorRef}
          size='small'
          sx={{
            border: "none",
            "&:disabled": {
              border: "none",
            },
          }}>
          <ExpandMoreIcon />
        </ToggleButton>
      </Stack>
      <DeepMenu
        options={modes}
        anchorRef={anchorRef}
        open={open}
        onClose={handleToggle}
        placement='left-end'
        onChange={onChange}
        setListItemIconProps={({ type } = { type: null }) =>
          type === "color"
            ? {
                sx: {
                  color,
                  border: (theme) => `2px inset ${theme.palette.divider}`,
                  borderRadius: 50,
                },
              }
            : {}
        }
        selected={[
          { id: mode, type: "mode" },
          { id: color, type: "color" },
        ]}
      />
    </React.Fragment>
  );
};

AnnotationButton.propTypes = {
  mode: PropTypes.string,
  onChange: PropTypes.func,
  active: PropTypes.bool,
  onToggleActive: PropTypes.func,
  color: PropTypes.string,
};

export default AnnotationButton;
