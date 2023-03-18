import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import errorsRefBase from './errorsRefBase';
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../components/Button';
import parse from 'html-react-parser';
import { initializeState } from '../../../redux/teleconference';

export default function CallActionResponse () {
    const { title, open, message, name } = useSelector(store => {
        const error = store.teleconference?.error;
        const type = store.teleconference.type;
        const errorText = errorsRefBase[
            error === 'call' ? error : `${error}-${type}`
        ];
        const title = errorText?.title;
        const message = errorText?.message;
        const open = Boolean(store.teleconference.error);
        const id = store.teleconference?.meetingId;
        const name = store.data[
            type === 'direct' ? 'contacts' : 'conversations'
        ]?.find(user => user.id === id)?.name;
        return {open, title, message, name};
    });
    const dispatch = useDispatch();
   
    return (
        <Dialog 
            open={open}
            BackdropProps={{
                sx: {
                    bgcolor: theme => theme.palette.background.paper +
                    theme.customOptions.opacity,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }
            }}
            PaperProps={{
                sx: { maxWidth: 500}
            }}
         >
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
                variant="body2"
            >
                {message && parse(message?.trim().replace('&###name###&', name))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
                onClick={() => dispatch(initializeState())}
            >
              D'accord
            </Button>
          </DialogActions>
        </Dialog>
    )
}