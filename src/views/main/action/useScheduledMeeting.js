import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography  } from '@mui/material';
import  { useSocket } from '../../../utils/SocketIOProvider';
import { bgcolor } from '@mui/system';

export default function useScheduledMeeting () {
    const socket = useSocket();
    const { enqueueSnackbar, closeSnackbar }= useSnackbar();

    useEffect(() => {
        const onScheduledMeeting = ({ who, where }) => {
            
        };

        setTimeout(() => {
            enqueueSnackbar(
                    <ListItem alignItems="flex-start" sx={{ bgcolor: 'red' }}>
                        <ListItemAvatar>
                        <Avatar alt="Travis Howard" />
                        </ListItemAvatar>
                        <ListItemText
                        primary="Summer BBQ"
                        secondary={
                            <React.Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                to Scott, Alex, Jennifer
                            </Typography>
                            {" — Wish I could come, but I'm out of town this…"}
                            </React.Fragment>
                        }
                        />
                    </ListItem>,
                   { 
                    style: {
                        "& .MuiSnackbarContent": {
                            p: 0,
                            bgcolor: 'red',
                        }
                    }
                });
        }, 1000);

        socket.on('scheduled', onScheduledMeeting);
        return () => {
            socket.off('scheduled', onScheduledMeeting);
        }
    }, [socket, enqueueSnackbar]);
}