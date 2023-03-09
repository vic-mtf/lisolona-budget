import CallEndIcon from '@mui/icons-material/CallEnd';
import { Fab, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addTeleconference } from '../../../redux/teleconference';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import decSong from '../../../assets/calldisconn_c5nf5f99.mp3';
import { useSocket } from '../../../utils/SocketIOProvider';
import { useCallback, useEffect, useRef } from 'react';

export default function HangUpCallButton () {
  const { agoraEngine, calls, setStatus, status, pickedUp } = useTeleconference();
  const {from, type, variant} = useSelector(store => {
    const clientId = store?.teleconference?.clientId;
    const variant = store?.teleconference?.variant;
    const contact = store.data?.contacts?.find(({id}) => id === clientId);
    const type = contact ? 'direct' : 'room';
    const from = clientId;
    return {from, type, variant};
  });
  const cancellableRef = useRef(true);
  const socket = useSocket();
  const dispatch = useDispatch();

  const hanldeHangUpCall = useCallback((hot='user') => {
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
        details: {hot}
      })
    cancellableRef.current = true;
  }, [agoraEngine, dispatch, from, socket, type]);

  useEffect(() => {
    const handleAutoHangUpCall = ({details}) => {
      cancellableRef.current = false;
      const hot = details?.hot;
      if(hot === 'auto') 
        setStatus('unanswered');  //Signalisation... appel manqué
      if(hot === 'user')
         setStatus('rejected'); //Signalisation... appel rejeté
    }
    socket?.on('hang-up', handleAutoHangUpCall);
    return () => {
      socket?.off('hang-up', handleAutoHangUpCall);
    }
  },[socket, hanldeHangUpCall, type, calls, setStatus, variant]);

  useEffect(() => {
    let timer;
    if(status !== 'calling') {
     timer = setTimeout(() => {
      switch(status) {
        case 'rejected': 
          window.navigator.vibrate([1000])
          if(type === 'direct') 
            hanldeHangUpCall();
          break;
        case 'unanswered': 
          if(type === 'direct') 
            hanldeHangUpCall();
          if(type === 'room' && calls?.length === 0 && variant === 'outgoing') 
            hanldeHangUpCall();
          break;
          default: break;
      }
      window.clearTimeout(timer);
     }, 1000);
    }
    return () => {
      if(timer !== undefined)
        window.clearTimeout(timer);
    }
  },[type, status, calls?.length, hanldeHangUpCall, variant]);

  useEffect(() => {
    let timer;
    if(variant === 'incoming' && !pickedUp && status === 'calling')
      timer = window.setTimeout(() => {
        hanldeHangUpCall('auto')
        window.clearTimeout(timer);
      }, 30000);

    return () => {
      if(timer !== undefined)
        window.clearTimeout(timer);
    }
  }, [status, variant, pickedUp, setStatus, hanldeHangUpCall])
    console.log(status);
  return (
    <Tooltip title="Racrocher" arrow>
    <Fab
        color="error"
        sx={{mx: 1, borderRadius: 1, boxShadow: 0}}
        onClick={hanldeHangUpCall}
        size="small"
        variant="extended"
        
    >
        <CallEndIcon fontSize="small" />
    </Fab>
    </Tooltip>
  )
}