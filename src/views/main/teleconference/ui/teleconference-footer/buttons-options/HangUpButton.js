import { useCallback, useMemo } from 'react';
import { Fab } from '@mui/material';
import CallEndOutlinedIcon from '@mui/icons-material/CallEndOutlined';
import { useSocket } from '../../../../../../utils/SocketIOProvider';
import { useDispatch, useSelector } from 'react-redux';
import answerRingtone from '../../../../../../utils/answerRingtone';
import { initializeState } from '../../../../../../redux/teleconference';

import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';

export default function HangUpButton () {
    const callId = useSelector(store => store.teleconference.callId);
    const mode = useSelector(store => store.teleconference.mode);
    const target = useSelector(store => store.teleconference.target);
    const from = useSelector(store => store.teleconference.from);
    const [{timers}] = useTeleconference();
    const socket = useSocket();
    const dispatch = useDispatch();

    const handleHangUp = useCallback(() => {
        const type = target?.type;
        const id = type === 'direct' ? (from?.id || target?.id) : target?.id
        const responses = {
          'incoming': 'rejected',
          'on': 'end',
          'outgoing': 'stop',
        };
        timers.forEach(timer => window.clearTimeout(timer));
        socket.emit('hang-up',{
          from: id, 
          type,
          details: {response: responses[mode]},
          callId,
        });
        dispatch(initializeState());
        const ringtone = answerRingtone({
          type: 'disconnect', 
          audio: new Audio(),
        });
        ringtone.loop = false;
    }, [dispatch, from, mode, socket, timers, callId]);

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