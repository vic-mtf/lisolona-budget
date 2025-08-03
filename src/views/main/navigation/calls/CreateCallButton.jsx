import { createElement, useState } from "react";
import AddIcCallOutlinedIcon from "@mui/icons-material/AddIcCallOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Divider,
  Dialog,
  Drawer,
  Fade,
  Toolbar,
  Typography,
} from "@mui/material";
import { joinOptions, options } from "./groupCall";
import useSmallScreen from "../../../../hooks/useSmallScreen";
import { useMemo } from "react";

export default function CreateCallButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialog, setDialog] = useState(null);
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const menuNavProps = useMemo(
    () =>
      matches
        ? { anchor: "bottom" }
        : {
            anchorEl,
            transformOrigin: { horizontal: "right", vertical: "top" },
            anchorOrigin: { horizontal: "left", vertical: "bottom" },
          },
    [matches, anchorEl]
  );
  return (
    <>
      <Tooltip arrow title='Créer un appel'>
        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
          <AddIcCallOutlinedIcon />
        </IconButton>
      </Tooltip>
      <MenuNav
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        {...menuNavProps}>
        <Fade in={matches} appear={false} unmountOnExit>
          <Toolbar variant='dense'>
            <Typography flexGrow={1} variant='body1' fontWeight='bold'>
              Selectionnez une action
            </Typography>
            <IconButton onClick={() => setAnchorEl(null)}>
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
        </Fade>
        {options.map(({ id, icon = "div", label, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={() => {
              setAnchorEl(null);
              setDialog(id);
            }}>
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
        <Divider component='li' />
        {joinOptions.map(({ id, icon = "div", label, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={() => {
              setAnchorEl(null);
              setDialog(id);
            }}>
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </MenuNav>
      {[...options, ...joinOptions].map(({ id, content, closed }) => (
        <Dialog
          fullScreen={matches}
          key={id}
          open={id === dialog}
          onClose={closed && (() => setDialog(false))}>
          {createElement(content, { onClose: () => setDialog(false) })}
        </Dialog>
      ))}
    </>
  );
}
