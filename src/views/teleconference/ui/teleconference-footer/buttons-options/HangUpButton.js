import {
    Fab
} from '@mui/material';
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import { useSocket } from '../../../../../utils/SocketIOProvider';
import { useDispatch, useSelector } from 'react-redux';
//import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import answerRingtone from '../../../../../utils/answerRingtone';
import { initializeState } from '../../../../../redux/teleconference';
import { useCallback } from 'react';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';

export default function HangUpButton () {
    const {from, type, mode} = useSelector(store => {
        const type = store.teleconference.type;
        const from = store.teleconference[
          type === 'room' ? 'meetingId' : 'from'
        ];
        const mode = store.teleconference.meetingMode;
        return {from, type, mode};
    });
    const [{timers}] = useTeleconference();
    const socket = useSocket();
    const dispatch = useDispatch();

    const handleHangUp = useCallback(() => {
        const responses = {
          'incoming': 'rejected',
          'on': 'end',
          'outgoing': 'stop',
        };
        timers.forEach(timer => window.clearTimeout(timer));
        socket.emit('hang-up',{
          from, 
          type,
          details: {response: responses[mode]}
        });
        dispatch(initializeState());
        const ringtone = answerRingtone({
          type: 'disconnect', 
          audio: new Audio(),
        });
        ringtone.loop = false;
    }, [dispatch, from, mode, socket, type, timers]);

    return (
        <Fab
          color="error"
          variant="extended"
          sx={{boxShadow: 0}}
          size="small"
          onClick={handleHangUp}
        >
          <CallEndOutlinedIcon fontSize="small" />
        </Fab>
    )
}