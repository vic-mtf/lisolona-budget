import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AddIcCallOutlinedIcon from '@mui/icons-material/AddIcCallOutlined';
import {
  Dialog,
  Drawer,
  Fade,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { createElement } from 'react';
import { options } from '@/views/main/navigation/calls/groupCall';
import { useMemo } from 'react';
import useSmallScreen from '@/hooks/useSmallScreen';
import ScheduledMeeting from '@/views/main/forms/scheduled-meeting/ScheduledMeeting';
import { useDispatch } from 'react-redux';
import { updateConferenceData } from '@/redux/conference/conference';
import { startNewCall } from '@/utils/handleStartNewCall';
import { useCallback } from 'react';

export default function StartCallButton({ user }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const matches = useSmallScreen();
  const dispatch = useDispatch();
  const MenuNav = useMemo(() => (matches ? Drawer : Menu), [matches]);
  const menuNavProps = useMemo(
    () =>
      matches
        ? { anchor: 'bottom' }
        : {
            anchorEl,
            transformOrigin: { horizontal: 'right', vertical: 'top' },
            anchorOrigin: { horizontal: 'left', vertical: 'bottom' },
          },
    [matches, anchorEl]
  );

  const actions = useMemo(
    () => ({
      'schedule-meeting': () => setScheduleOpen(true),
    }),
    []
  );

  const onCloseDialog = useCallback(() => {
    setScheduleOpen(false);
  }, []);

  return (
    <>
      <Tooltip
        title={user?.type === 'room' ? 'Démarrer la réunion' : "Lancer l'appel"}
      >
        <IconButton
          sx={{ position: 'relative' }}
          onClick={(e) => {
            if (user?.type === 'room') setAnchorEl(e.currentTarget);
            else {
              const callTarget = user?.members?.find(
                ({ id }) => id === user?.id
              );
              startNewCall(callTarget);
            }
          }}
        >
          {user?.type === 'room' ? (
            <AddIcCallOutlinedIcon />
          ) : (
            <PhoneOutlinedIcon />
          )}
        </IconButton>
      </Tooltip>

      <MenuNav
        onClose={() => setAnchorEl(null)}
        open={Boolean(anchorEl)}
        {...menuNavProps}
      >
        <Fade in={matches} appear={false} unmountOnExit>
          <Toolbar variant="dense">
            <Typography flexGrow={1} variant="body1" fontWeight="bold">
              Sélectionnez une action
            </Typography>
            <IconButton onClick={() => setAnchorEl(null)}>
              <CloseOutlinedIcon />
            </IconButton>
          </Toolbar>
        </Fade>

        {options.map(({ label, id, icon = 'div', action, disabled }) => (
          <MenuItem
            key={id}
            disabled={disabled}
            onClick={(event) => {
              if (typeof action === 'function') action(event, user);
              if (typeof actions[id] === 'function') actions[id](event);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{createElement(icon)}</ListItemIcon>
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </MenuNav>
      <Dialog
        fullScreen={matches}
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      >
        <ScheduledMeeting onClose={onCloseDialog} room={user} />
      </Dialog>
    </>
  );
}

// export const options = [
//   {
//     label: "Démarrer une réunion instantanée",
//     icon: HistoryToggleOffOutlinedIcon,
//     id: "start-meeting",
//     content: InstantMeeting,
//   },
//   {
//     label: "Planifier une réunion",
//     icon: DateRangeOutlinedIcon,
//     id: "schedule-meeting",
//     content: ScheduledMeeting,
//   },
//   {
//     label: "Démarrer une diffusion en direct",
//     icon: CastOutlinedIcon,
//     id: "start-live-streaming",
//     disabled: true,
//     content: "div",
//   },
// ];
