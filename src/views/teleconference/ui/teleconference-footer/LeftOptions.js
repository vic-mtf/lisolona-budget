import {
    Box as MuiBox,
    Stack
} from '@mui/material';
import ToggleChatButton from './buttons-options/ToggleChatButton';
import ToggleListMembersButton from './buttons-options/ToggleListMembersButton';
import ToggleSharScreen from './buttons-options/ToggleScreenSharingButton';

export default function LeftOptions () {
    return (
        <MuiBox
            justifyContent="right"
            alignItems="center"
            display="flex"
            component={Stack}
            spacing={2}
            direction="row"
            bgcolor="red"
        >
          <ToggleSharScreen/>
          <ToggleChatButton/>
          <ToggleListMembersButton/>
        </MuiBox>
    )
}