import { useCallback, useMemo } from 'react';
import { Fab } from '@mui/material';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import { useTeleconference } from '../../../../../../utils/TeleconferenceProvider';
import { useSocket } from '../../../../../../utils/SocketIOProvider';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../../../../redux/teleconference';
import usePublishLocalTracks from '../../../actions/publish/usePublishLocalTracks';

export default function PickUpButton () {
    const [{audio}] = useTeleconference();
    const dispatch = useDispatch();
    const callId = useSelector(store => store.teleconference.callId);
    const joined = useSelector(store => store.teleconference.joined);
    const target = useSelector(store => store.teleconference.target);
    const from = useSelector(store => store.teleconference.from);
    const socket = useSocket();
    const onPublishLocalTracks = usePublishLocalTracks();

    const handlePickUp = useCallback (() => {
        const type = target?.type;
        const id = type === 'direct' ? from?.id : target?.id;
        if(joined) onPublishLocalTracks();
        audio.src = null;
        socket.emit('pick-up', {from: id, type, callId});
        dispatch(addTeleconference({
            key: 'data',
            data: {
                mode: 'on',
                videoMirrorMode: 'float',
                date: (new Date()).toString(),
            }
        }));
    }, [ 
        callId, 
        audio, 
        dispatch, 
        socket, 
        onPublishLocalTracks, 
        joined
    ]);

    return (
        <Fab
            color="success"
            sx={{boxShadow: 0}}
            size="small"
            variant="extended"
            onClick={handlePickUp}
        >
          <LocalPhoneOutlinedIcon fontSize="small" />
        </Fab>
    )
}