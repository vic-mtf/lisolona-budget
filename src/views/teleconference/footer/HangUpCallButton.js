import CallEndIcon from '@mui/icons-material/CallEnd';
import { Fab, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../redux/teleconference';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import decSong from '../../../assets/calldisconn_c5nf5f99.mp3';
import { useSocket } from '../../../utils/SocketIOProvider';
import { useCallback, useEffect, useRef } from 'react';

export default function HangUpCallButton () {
  const { agoraEngine } = useTeleconference();
  const {from, type} = useSelector(store => {
    const clientId = store?.teleconference?.clientId;
    const contact = store.data?.contacts?.find(({id}) => id === clientId);
    const type = contact ? 'direct' : 'room';
    const from = clientId;
    return {from, type};
  });
  const cancellableRef = useRef(true);
  const socket = useSocket();
  const dispatch = useDispatch();

  const hanldeHangUpCall = useCallback(() => {
    agoraEngine?.localTracks.forEach(strack => {
      strack?.close();
      strack?.stop();
    });
    agoraEngine?.leave();
    dispatch(addTeleconference({
        key: 'data', 
        data: {
          clientId: null,
          isCalling: false,
          type: null,
          variant: null,
        }
    }));
    const audio = new Audio();
    audio.src = decSong;
    audio.autoplay = true;
    if(cancellableRef.current)
      socket.emit('hang-up',{
        from,
        type,
      })
    cancellableRef.current = true;
  }, [agoraEngine, dispatch, from, socket, type]);

  useEffect(() => {
    const handleAutoHangUpCall = () => {
      cancellableRef.current = false;
      if(type === 'direct')
        hanldeHangUpCall();
    }
    socket?.on('hang-up', handleAutoHangUpCall);
    return () => {
      socket?.off('hang-up', handleAutoHangUpCall);
    }
  },[socket, hanldeHangUpCall, type]);

  return (
    <Tooltip title="Racrocher" arrow>
    <Fab
        color="error"
        sx={{mx: 1}}
        onClick={hanldeHangUpCall}
        size="small"
    >
        <CallEndIcon fontSize="small" />
    </Fab>
    </Tooltip>
  )
}