import React from 'react';
import { DialogActions, ListItem, ListItemAvatar, ListItemText, SnackbarContent } from '@mui/material';
import AvatarStatus from '../../../components/AvatarStatus';
import Button from '../../../components/Button';

const newMeetingSnackbar = ({
    onJoinMeeTing, 
    onCancelMeeting, 
    name, 
    id,
    avatarSrc,
    theme,
}) => {

    const content = (
        <SnackbarContent
            sx={{
                maxWidth: 500,
                bgcolor: 'background.paper'
            }}
            message={
                <ListItem alignItems="flex-start" dense>
                    <ListItemAvatar>
                        <AvatarStatus
                            id={id}
                            name={name}
                            type="room"
                            avatarSrc={avatarSrc}
                        />
                    </ListItemAvatar>
                    <ListItemText
                    primary={name}
                    primaryTypographyProps={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                    }}
                    secondaryTypographyProps={{
                        variant: 'body2',
                        color: 'text.secondary',
                    }}
                    secondary={
                        `Nous avons le plaisir de vous 
                        informer qu'une nouvelle réunion est en cours. 
                        Vous êtes invité(e) à y participer. 
                        Merci de votre attention.`
                    }
                    />
            </ListItem>
            }
            action={
                <DialogActions>
                    <Button variant="contained" onClick={onJoinMeeTing}>
                        Participer
                    </Button>
                    <Button onClick={onCancelMeeting}>
                        Annuler
                    </Button>
                </DialogActions>
            }
        >
           
        </SnackbarContent>
    );
    return {
        content,
    }
};

export default newMeetingSnackbar;
