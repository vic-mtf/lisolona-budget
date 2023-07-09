import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import errorsRefBase from '../errors/errorsRefBase';
import { useDispatch, useSelector } from 'react-redux'
import Button from '../../../../../components/Button';
import parse from 'html-react-parser';
import { initializeState } from '../../../../../redux/teleconference';
import { useMemo } from 'react';

export default function CallActionResponse () {
    const error = useSelector(store => store.teleconference?.error);
    const target = useSelector(store => store.teleconference?.target);
    const errorText = useMemo(() => errorsRefBase[
        error === 'call' ? error : `${error}-${target?.type}`
    ], [error, target?.type]);
    const dispatch = useDispatch();
   
    return (
        <Dialog 
            open={Boolean(error)}
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
            {errorText?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
                variant="body2"
            >
                {errorText?.message && parse(errorText?.message?.trim().replace('&###name###&', target?.name))}
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