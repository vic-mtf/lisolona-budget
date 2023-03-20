import {
    Box as MuiBox,
    Slide,
    Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import ToggleChatButton from './buttons-options/ToggleChatButton';
import ToggleListMembersButton from './buttons-options/ToggleListMembersButton';
import ToggleSharScreen from './buttons-options/ToggleScreenSharingButton';

export default function RightOptions () {
    return (
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
    )
}