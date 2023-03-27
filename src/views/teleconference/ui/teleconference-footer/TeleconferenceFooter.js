import { 
    Toolbar,
    Box as MuiBox,
 } from '@mui/material'
import { useSelector } from 'react-redux'
import LeftOptions from './LeftOptions';
import LocalOptions from './LocalOptions'
import RightOptions from './RightOptions'

export default function TeleconferenceFooter () {
    const {isFloat} = useSelector(store => {
        const isFloat = false;//Boolean(store.teleconference.priorityTargetId);
        return {isFloat}
    });

    return (
        <Toolbar
            variant="dense"
            {...isFloat && {sx: {
                position: 'absolute',
                width: '100%',
                bottom: 0,
                color: 'white',
                bgcolor: theme => theme.palette.divider,
                zIndex: theme => theme.zIndex.drawer,
            }}}
        >
            <MuiBox 
                flexGrow={1}
                maxWidth={300}
            >
                <LeftOptions/>
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