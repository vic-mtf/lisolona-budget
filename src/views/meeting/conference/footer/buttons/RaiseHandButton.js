import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import IconButton from '../../../../../components/IconButton';
import { Stack, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setConferenceData } from '../../../../../redux/conference';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import store from '../../../../../redux/store';

export default function RaiseHandButton () {
    const handRaised = useSelector(store => store.conference.handRaised);
    const dispatch = useDispatch();
    const socket = useSocket();
    const handleRaiseHand = useCallback(() => {
        const state = !handRaised;
        dispatch(setConferenceData({ data: { handRaised: state }}));
        socket.emit('signal', {
            id: store.getState().meeting.meetingId,
            type: 'state',
            obj: {handRaised: state},
            who: [store.getState().meeting?.me?.id],
        });
    },[handRaised, dispatch, socket]);

    return (
        <Stack
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            spacing={.1}
        >
            <Tooltip title={`${handRaised ? 'Baisser': 'Lever' } la main`} arrow>
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
            </Tooltip>
        </Stack>
    );
}
