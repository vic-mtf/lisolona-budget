import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import IconButton from '../../../../../components/IconButton';
import { Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setConferenceData } from '../../../../../redux/conference';

export default function RaiseHandButton () {
    const handRaised = useSelector(store => store.conference.handRaised);
    const dispatch = useDispatch();

    const handleRaiseHand = useCallback(() => {
        const state = !handRaised;
        dispatch(setConferenceData({ data: { handRaised: state}}));
    },[handRaised, dispatch]);

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
                <IconButton
                    size="small"
                    color="primary"
                    onClick={handleRaiseHand}
                    selected={handRaised}
                    sx={{
                        zIndex: 0,
                        borderRadius: 1,
                        boxShadow: 'none',
                    }}
                >
                    <BackHandOutlinedIcon/>
                </IconButton>
            {/* <Typography
                noWrap
                fontSize={10.5}
            >
                Lever la main
            </Typography> */}
        </Stack>
    );
}
