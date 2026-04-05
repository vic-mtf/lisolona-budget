import React from "react";
import { IconButton, Box, Fab, alpha, Tooltip } from "@mui/material";
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
              sx={{ p: 0, aspectRatio: 1 }}
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

SplitButton.displayName = "SplitButton";

export default React.memo(SplitButton);
