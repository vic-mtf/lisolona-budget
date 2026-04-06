import { createElement, useState } from 'react';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
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
} from '@mui/material';
import { joinOptions, options } from './groupCall';
import useSmallScreen from '@/hooks/useSmallScreen';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';

export default function CreateCallButton() {
  const [openMenuNav, setOpenMenuNav] = useState(false);
  const anchorElRef = useRef(null);
  const [dialog, setDialog] = useState(null);
  const matches = useSmallScreen();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const onCloseDialog = useCallback(() => setDialog(null), []);
  const onCloseMenuNav = useCallback(() => setOpenMenuNav(false), []);
  const menuNavProps = useMemo(
    () =>
      matches
        ? { anchor: 'bottom' }
        : {
            transformOrigin: { horizontal: 'right', vertical: 'top' },
            anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
          },
    [matches]
  );

  return (
    <>
      <Tooltip arrow title="Créer un appel">
        <IconButton onClick={() => setOpenMenuNav(true)} ref={anchorElRef}>
          <AddIcCallOutlinedIcon />
        </IconButton>
      </Tooltip>
      <MenuNav
        open={openMenuNav}
        onClose={() => setOpenMenuNav(false)}
        {...menuNavProps}
        {...(!matches && { anchorEl: anchorElRef.current })}
      >
        <Fade in={matches} appear={false} unmountOnExit>
          <Toolbar variant="dense">
            <Typography flexGrow={1} variant="body1" fontWeight="bold">
              Sélectionnez une action
            </Typography>
            <IconButton onClick={onCloseMenuNav}>
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
        </Fade>
        {options.map(({ id, icon = 'div', label, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={() => {
              onCloseMenuNav();
              setDialog(id);
            }}
          >
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
        <Divider component="li" />
        {joinOptions.map(({ id, icon = 'div', label, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={() => {
              onCloseMenuNav;
              setDialog(id);
            }}
          >
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </MenuNav>
      {[...options, ...joinOptions].map(
        ({ id, content: FormContent, closed }) => (
          <Dialog
            fullScreen={matches}
            key={id}
            open={id === dialog}
            onClose={() => {
              if (closed) onCloseDialog(false);
            }}
          >
            <FormContent onClose={onCloseDialog} />
          </Dialog>
        )
      )}
    </>
  );
}
