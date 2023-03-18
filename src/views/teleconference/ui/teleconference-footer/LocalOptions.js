import {
    Box as MuiBox,
    Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import HangUpButtion from './buttons-options/HangUpButton';
import PickUpButton from './buttons-options/PickUpButton';
import ToggleCameraButton from './buttons-options/ToggleCameraButton';
import ToggleMicroButton from './buttons-options/ToggleMicroButton';

export default function LocalOptions () {
    const mode = useSelector(store => store.teleconference.meetingMode);
    return (
        <MuiBox
            justifyContent="center"
            alignItems="center"
            display="flex"
            component={Stack}
            spacing={2}
            direction="row"
        >
          <ToggleCameraButton/>
          <ToggleMicroButton/>
          {mode === 'incoming' && <PickUpButton/>}
          <HangUpButtion/>
        </MuiBox>
    )
}