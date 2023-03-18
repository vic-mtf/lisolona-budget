import { 
    Toolbar,
    Box as MuiBox
 } from '@mui/material'
import ContactStatus from './ContactStatus';
import ToggleScreenSizeButton from './ToggleScreenSizeButton';
import ViewButton from './ViewButton';
import appConfig from '../../../../configs/app-config.json';

export default function TeleconferenceHeader () {
    
    return (
        <Toolbar
            variant="dense"
            sx={{bgcolor: appConfig.colors.main}}
        >
            <ToggleScreenSizeButton/>
            <ContactStatus/>
            <ViewButton/>
        </Toolbar>
    )
}