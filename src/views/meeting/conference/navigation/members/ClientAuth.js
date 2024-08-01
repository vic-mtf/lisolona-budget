import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from "@mui/material";
// import DialogContentText from '@mui/material/DialogContentText';
import Button from "../../../../../components/Button";
import { options } from "../admin-options/MeetingManagementOptions";
import useSocket from "../../../../../hooks/useSocket";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import { setConferenceData } from "../../../../../redux/conference";
import getFullName from "../../../../../utils/getFullName";
import store from "../../../../../redux/store";

export default function ClientAuth() {
  const auth = useSelector((store) => store.conference.moderatorOptions.auth);
  const socket = useSocket();
  const participants = useSelector((store) => store.conference.participants);
  const dispatch = useDispatch();
  const user = useMemo(
    () => participants.find(({ identity }) => identity?._id === auth?.id),
    [auth?.id, participants]
  );
  const handleClose = useCallback(() => {
    dispatch(
      setConferenceData({
        data: {
          moderatorOptions: {
            auth: { open: false },
          },
        },
      })
    );
  }, [dispatch]);

  return (
    <Dialog
      open={auth.open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          maxWidth: 400,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
      BackdropProps={{
        sx: {
          bgcolor: (theme) =>
            theme.palette.background.paper + theme.customOptions.opacity,
          backdropFilter: (theme) => `blur(${theme.customOptions.blur})`,
        },
      }}>
      <DialogTitle>
        Autorisations appliquées à {getFullName(user?.identity)}
      </DialogTitle>
      <DialogContent>
        <List>
          {options.map(({ key, icon, label, description }) => {
            const auth = user?.auth[key];
            const disabledAuth = auth === undefined;
            const state = Boolean(auth);

            return (
              <ListItem
                key={key}
                disabled={disabledAuth}
                alignItems='flex-start'>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText
                  id={`switch-list-label-${label}`}
                  primary={label}
                  secondary={description}
                  secondaryTypographyProps={{
                    variant: "caption",
                  }}
                />
                <Switch
                  edge='end'
                  size='small'
                  checked={state}
                  disabled={disabledAuth}
                  onChange={() => {
                    socket.emit("signal", {
                      id: store.getState().meeting.meetingId,
                      type: "auth",
                      obj: { [key]: !state },
                      who: [user?.identity?._id],
                    });
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
