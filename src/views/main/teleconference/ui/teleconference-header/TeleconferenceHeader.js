import { 
    Toolbar,
 } from '@mui/material'
import ContactStatus from './ContactStatus';
import ToggleScreenSizeButton from './ToggleScreenSizeButton';
import ViewButton from './ViewButton';
import appConfig from '../../../../../configs/app-config.json';

export default function TeleconferenceHeader () {
    const isFloat = false;
    return (
        <Toolbar
            variant="dense"
            sx={isFloat ? {
                bgcolor: theme => theme.palette.divider,
                position: 'absolute',
                width: '100%',
                top: 0,
                zIndex: theme => theme.zIndex.drawer,
            } :{
                bgcolor: appConfig.colors.main
            }}
        >
            <ToggleScreenSizeButton/>
            <ContactStatus/>
            <ViewButton/>
        </Toolbar>
    )
}