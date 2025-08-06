import React from "react";
import { IconButton, Box, Fab, alpha, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

const SplitButton = React.forwardRef(
  (
    {
      onClick,
      active,
      disabled,
      onExpand,
      icon,
      activeIcon,
      error,
      disabledMoreButton,
      disabledTitle,
      activeTitle,
      inactiveTitle,
    },
    ref
  ) => {
    return (
      <Box
        ref={ref}
        display='flex'
        alignItems='center'
        gap={0.25}
        p={0.25}
        flexDirection='row'
        borderRadius={1.5}
        position='relative'
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
        }}>
        <Tooltip
          title={
            (disabled ? disabledTitle : active ? activeTitle : inactiveTitle) ||
            ""
          }>
          <div>
            <Fab
              variant='extended'
              disabled={disabled}
              size='small'
              sx={{ aspectRatio: 1 }}
              color={error ? "error" : active ? "primary" : "default"}
              onClick={onClick}>
              {active ? activeIcon || icon : icon}
            </Fab>
          </div>
        </Tooltip>
        <Box>
          <CustomIconButton
            disabled={error || disabled || disabledMoreButton}
            onClick={onExpand}
            size='small'>
            <ExpandMoreOutlinedIcon />
          </CustomIconButton>
        </Box>
      </Box>
    );
  }
);

export const CustomIconButton = ({ onClick, disabled, children, ...props }) => {
  return (
    <IconButton
      disabled={disabled}
      onClick={onClick}
      size='small'
      {...props}
      sx={{
        bgcolor: (t) =>
          alpha(
            t.palette.common[t.palette.mode === "dark" ? "white" : "black"],
            0.05
          ),
      }}>
      {children}
    </IconButton>
  );
};

CustomIconButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

SplitButton.displayName = "SplitButton";

SplitButton.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onExpand: PropTypes.func,
  icon: PropTypes.node,
  activeIcon: PropTypes.node,
  error: PropTypes.bool,
  disabledMoreButton: PropTypes.bool,
  disabledTitle: PropTypes.string,
  activeTitle: PropTypes.string,
  inactiveTitle: PropTypes.string,
};

export default React.memo(SplitButton);
