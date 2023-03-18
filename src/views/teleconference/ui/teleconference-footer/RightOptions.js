import {
    Box as MuiBox,
    Slide,
    Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import ToggleChatButton from './buttons-options/ToggleChatButton';
import ToggleListMembersButton from './buttons-options/ToggleListMembersButton';
import ToggleSharScreen from './buttons-options/ToggleScreenSharingButton';

navigator.permissions.query({ name: "" })

export default function RightOptions () {
    const mode = useSelector(store => store.teleconference.meetingMode);
    return (
        <Slide 
            in={mode === 'on'}
            direction="left"
        >
            <MuiBox
                justifyContent="right"
                alignItems="center"
                display="flex"
                component={Stack}
                spacing={2}
                direction="row"
            >
            <ToggleSharScreen/>
            <ToggleChatButton/>
            <ToggleListMembersButton/>
            </MuiBox>
        </Slide>
    )
}