import {
    Box as MuiBox,
    Stack
} from '@mui/material';
import RaiseHandButton from './buttons-options/RaiseHandButton';

export default function LeftOptions () {
    return (
        <MuiBox
            justifyContent="left"
            alignItems="center"
            display="flex"
            component={Stack}
            spacing={2}
            direction="row"
        >
          <RaiseHandButton/>
        </MuiBox>
    )
}