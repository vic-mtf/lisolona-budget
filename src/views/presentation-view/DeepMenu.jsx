import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
  Box,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import PropTypes from "prop-types";
import SubMenuItem from "./SubMemuItem";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";

const DeepMenu = ({
  anchorRef,
  open,
  onClose,
  options,
  selected,
  onChange,
  placement,
  setListItemIconProps = () => ({}),
  setButtonSubMenuItemProps = () => ({}),
  setListItemButton = () => ({}),
}) => {
  const handleMenuItemClick = (event, option) => {
    if (typeof onChange === "function") onChange(event, option);
    if (typeof onClose === "function") onClose(false);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    if (typeof onClose === "function") onClose();
  };

  return (
    <Popper
      sx={{
        zIndex: 1,
      }}
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      placement={placement}
      disablePortal>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom",
          }}>
          <Paper sx={{ mx: 0.5 }}>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList id='split-button-menu' autoFocusItem>
                {options.map(({ icon: Icon, ...option }) => (
                  <Box
                    disabled={option.disabled}
                    {...(option?.children?.length > 0
                      ? {
                          component: SubMenuItem,
                          options: option.children,
                          selected,
                          onChange,
                          onClose,
                          ...setButtonSubMenuItemProps(option),
                        }
                      : {
                          component: ListItemButton,
                          selected: selected?.some(
                            ({ type, id }) =>
                              type === option.type && id === option.id
                          ),
                          onClick: (event) =>
                            handleMenuItemClick(event, option),
                          ...setListItemButton(option),
                        })}
                    key={option?.id}>
                    {Icon && (
                      <ListItemIcon>
                        <Icon {...setListItemIconProps(option)} />
                      </ListItemIcon>
                    )}
                    <ListItemText primary={option?.label} />
                    {options?.some(({ children }) => children) && (
                      <ListItemIcon sx={{ justifyContent: "right" }}>
                        {option?.children?.length > 0 && (
                          <NavigateNextOutlinedIcon />
                        )}
                      </ListItemIcon>
                    )}
                  </Box>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

DeepMenu.propTypes = {
  anchorRef: PropTypes.object.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  placement: PropTypes.oneOf([
    "auto-end",
    "auto-start",
    "auto",
    "bottom-end",
    "bottom-start",
    "bottom",
    "left-end",
    "left-start",
    "left",
    "right-end",
    "right-start",
    "right",
    "top-end",
    "top-start",
    "top",
  ]),
  setListItemIconProps: PropTypes.func,
  setButtonSubMenuItemProps: PropTypes.func,
  setListItemButton: PropTypes.func,
};

export default DeepMenu;
