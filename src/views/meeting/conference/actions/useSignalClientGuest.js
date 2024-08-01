import { useEffect } from "react";
import {
  Box as MuiBox,
  ListItem,
  ListItemText,
  DialogActions,
  ListItemIcon,
  Stack,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useSocket from "../../../../hooks/useSocket";
import store from "../../../../redux/store";
import useCustomSnackbar from "../../../../components/useCustomSnackbar";
import AvatarStatus from "../../../../components/AvatarStatus";
import Typography from "../../../../components/Typography";
import Button from "../../../../components/Button";
import IconButton from "../../../../components/IconButton";
import getFullName from "../../../../utils/getFullName";

export default function useSignalClientGuest() {
  const socket = useSocket();
  const { enqueueCustomSnackbar, closeCustomSnackbar } = useCustomSnackbar();

  useEffect(() => {
    const handleSignalGuest = (value) => async (event) => {
      if (store.getState().meeting.meetingId === event?.where?._id) {
        let { name, _id: id, imageUrl: avatarSrc } = event?.who || {};
        name = name || getFullName(event?.who);
        let key;
        enqueueCustomSnackbar({
          getKey: (_key) => (key = _key),
          message: (
            <MuiBox>
              <Typography component='span' variant='body2' color='text.primary'>
                {" "}
                {name} souhaite rejoindre la réunion.
              </Typography>
              <DialogActions>
                <Button children='Voir' disabled />
                <Button
                  children='Accepter'
                  onClick={() => {
                    closeCustomSnackbar(key);
                    socket?.emit("accept", {
                      where: event?.where?._id,
                      who: id,
                    });
                  }}
                />
              </DialogActions>
            </MuiBox>
          ),
          icon: (
            <AvatarStatus
              invisible
              name={name}
              id={id}
              type='direct'
              sx={{
                width: 30,
                height: 30,
              }}
              avatarSrc={avatarSrc}
            />
          ),
          action: (
            <Stack
              spacing={1}
              direction='row'
              display='flex'
              justifyContent='center'
              alignContent='center'>
              {/* <IconButton
                                disableTouchRipple
                            >
                                <AnimatedWavingHand/>
                            </IconButton> */}
              <IconButton onClick={() => closeCustomSnackbar(key)}>
                <CloseOutlinedIcon />
              </IconButton>
            </Stack>
          ),
        });
        // enqueueCustomSnackbar({
        //     persist: true,
        //     getKey: _key => key = _key,
        //     SnackbarContentProps: {
        //         // onMouseEnter () {
        //         //     cursorOn = true;
        //         // },
        //         // onMouseLeave () {
        //         //     cursorOn = false;
        //         // }
        //     },
        //     message: (
        //         <ListItem alignItems="flex-start" dense>
        //             <AvatarStatus
        //                 id={id}
        //                 avatarSrc={avatarSrc}
        //                 type="direct"
        //                 name={name}
        //             />
        //             <ListItemText
        //                 primary={name}
        //                 primaryTypographyProps={{
        //                     fontWeight: 'bold',
        //                     color: 'text.primary'
        //                 }}
        //                 secondary={
        //                     <Typography
        //                         sx={{ display: 'inline' }}
        //                         component="span"
        //                         variant="body2"
        //                         color="text.primary"
        //                     >
        //                         Une personne souhaite rejoindre la réunion.
        //                         Veuillez accorder l'autorisation d'accès à
        //                         cette personne afin qu'elle puisse vous rejoindre
        //                     </Typography>
        //                 }
        //             />
        //             <ListItemIcon>
        //                 <IconButton
        //                      onClick={() => {
        //                         closeCustomSnackbar(key);
        //                     }}
        //                 >
        //                     <CloseOutlinedIcon/>
        //                 </IconButton>
        //             </ListItemIcon>
        //     </ListItem>
        //     ),
        //     action : (
        //         <DialogActions
        //             sx={{ p: 0, m: 0 }}
        //         >
        //             <Button
        //                 variant="outlined"
        //                 onClick={() => {
        //                     closeCustomSnackbar(key);
        //                     socket?.emit('accept', {
        //                        where: event?.where?._id,
        //                        who: id,
        //                     });
        //                 }}>
        //                 Accepter
        //             </Button>
        //             <Button
        //                 onClick={() => {
        //                     closeCustomSnackbar(key);
        //                 }}
        //             >
        //                 Annuler
        //             </Button>
        //         </DialogActions>
        //     )
        // });
      }
    };
    const f1 = handleSignalGuest(1);
    const f2 = handleSignalGuest(2);

    socket?.on("guest", f1);
    socket?.on("guests", f2);
    return () => {
      socket.off("guest", f1);
      socket.off("guests", f2);
    };
  }, [socket]);
}
