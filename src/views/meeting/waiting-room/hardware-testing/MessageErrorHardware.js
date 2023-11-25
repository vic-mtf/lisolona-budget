import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
 } from '@mui/material';
import Button from '../../../../components/Button';
import { useEffect, useMemo, useState } from 'react'
import errorDevices from './errorDevices';

export default function MessageErrorHardware ({open, errorsArray=[], onClose}) {
    const error = useMemo(() => errorDevices(...errorsArray), [errorsArray]);

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            BackdropProps={{
                sx: {
                    bgcolor: theme => theme.palette.background.paper +
                    theme.customOptions.opacity,
                    backdropFilter: theme => `blur(${theme.customOptions.blur})`,
                }
            }}
            PaperProps={{
                sx: { maxWidth: 500},
            }}
        >
            <DialogTitle>
                    {error.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {error.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="primary"
                >Fermer
                </Button>
            </DialogActions>
        </Dialog>
    )
}