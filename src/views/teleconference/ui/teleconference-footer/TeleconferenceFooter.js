import { 
    Toolbar,
    Box as MuiBox,
    Slide
 } from '@mui/material'
import { useSelector } from 'react-redux'
//import LeftOptions from './LeftOptions';
import LocalOptions from './LocalOptions'
import RightOptions from './RightOptions'

export default function TeleconferenceFooter () {
    const mode = useSelector(store => store.teleconference?.meetingMode);
    return (
        <Toolbar
            variant="dense"
        >
            <MuiBox 
                flexGrow={1}
                maxWidth={300}
            >
                {/* <LeftOptions/> */}

            </MuiBox>
            <MuiBox flexGrow={1}>
            <LocalOptions/>
            </MuiBox>
            <MuiBox 
                flexGrow={1}
                maxWidth={300}
            >
                <RightOptions/>
            </MuiBox>
        </Toolbar>
    )
}