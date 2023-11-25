import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
 } from '@mui/material';
import Button from '../../../../components/Button';
import { useEffect, useState } from 'react'
import checkPermissionState from './checkPermissionState';
import useGetMediaStream from '../../actions/useGetMediaStream';

export default function AlertDeviceHardware () {
    const [deviceAlert, setDeviceAlert] = useState(null);
    const handleGetStream = useGetMediaStream();

    useEffect(() => {
        checkPermissionState().then(data => {
            if(['denied', 'prompt'].includes(data.state)) {
                setDeviceAlert(data);
            } else handleGetStream();

        });
    }, [handleGetStream]);
    
    return (
        <Dialog 
            open={Boolean(deviceAlert)} 
           // onClose={onClose}
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
                    {deviceAlert?.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {deviceAlert?.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        handleGetStream();
                        setDeviceAlert(null);
                    }}
                    color="primary"
                >D'accord
                </Button>
            </DialogActions>
        </Dialog>
    )
}