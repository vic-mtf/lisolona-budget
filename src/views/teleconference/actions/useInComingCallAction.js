import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /*addTeleconference,*/ initializeState } from "../../../redux/teleconference";
import answerRingtone from "../../../utils/answerRingtone";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../utils/TeleconferenceProvider";

export default function useInComingCallAction () {
    const dispatch = useDispatch();
    const socket = useSocket();
    const timersRef = useRef([]);
    const {mode, error, type, options, joined, modeId, mediaType} = useSelector(store => {
        const mode = store.teleconference?.meetingMode;
        const error = store.teleconference?.error;
        const type = store.teleconference?.type;
        const options = store.teleconference?.options;
        const joined = store.teleconference?.joined;
        const modeId = store.teleconference?.meetingId;
        const mediaType = store.teleconference?.mediaType;
        return {mode, error, type, options, joined, joined, modeId, mediaType};
    });
    const [
        {audio, stream},
        {handleJoinChannel}
    ] = useTeleconference();
    const agoraEngineRef = useRef();

    useEffect(() => {
        let ringtone, data;
        const handleIncomingCall = ({from: _from, details, room}) => {
            const {mediaType, type, id, options} = details;
            const from  = room ? id : _from?._id;
            if(mode === 'none' || error) {
                data = {
                    meetingMode: 'incoming',
                    privileged: true,
                    video: mediaType === 'video',
                    audio: true,
                    mediaType,
                    type,
                    videoMirrorMode: 'grid',
                    meetingId: id,
                    response: 'incoming',
                    options,
                    from,
                };
                dispatch(initializeState({data, key: 'data'}));
                ringtone = answerRingtone({type: 'incoming', audio});
                ringtone.loop = true;
                timersRef.current.push(window.setTimeout(() => {
                    timersRef?.current?.forEach(
                        timer => window.clearTimeout(timer)
                    );
                    socket.emit('hang-up', {
                        from, 
                        type,
                        details: {response: 'unanswered'}
                    });
                    dispatch(initializeState());
                    ringtone.src = null;
                }, 30000));
            } else {
                socket.emit('hang-up', {
                    from, 
                    type,
                    details: {response: 'busy'}
                });
                // Signalisation... un nouveau appel
            }
        };
        const handleHangUpCall = ({details}) => {
            data = null;
            if(mode === 'incoming') {
                const {response} = details;
                switch(response) {
                    case 'stop':
                        timersRef.current.forEach(timer => window.clearTimeout(timer));
                        audio.src = null;
                        dispatch(initializeState())
                        break;
                    default: break;
                }
            }
            if(mode === 'on' && type === 'direct') {
                const {response} = details;
                switch(response) {
                    case 'end':
                        timersRef.current.forEach(timer => window.clearTimeout(timer));
                        audio.src = null;
                        ringtone = answerRingtone({
                            type: 'disconnect', 
                            audio: new Audio(),
                        });
                        ringtone.loop = false;
                        dispatch(initializeState())
                        break;
                    default: break;
                }
            }
        };
        socket?.on('hang-up', handleHangUpCall);
        socket?.on('incoming-call', handleIncomingCall);
        return () => {
            socket?.off('incoming-call', handleIncomingCall);
            socket?.off('hang-up', handleHangUpCall);
        }
    },[dispatch, socket, mode, audio, error]);

    useEffect(() => {
        if(mode === 'incoming') {
            const handleCall = (status, agoraEngine) => {
                if(status === 'success') 
                   agoraEngineRef.current = agoraEngine;
           }
   
           if(stream && options && !joined) 
               handleJoinChannel(handleCall);
        }
        if(mode === 'none' && agoraEngineRef.current)
            (async() => await agoraEngineRef.current?.leave())();
        if(mode === 'on' || mode === 'none') {
            timersRef.current.forEach(timer => window.clearTimeout(timer));
            timersRef.current = [];
            audio.src = null;
        }
    } ,[
        options, 
        joined, 
        mode, 
        handleJoinChannel, 
        modeId, 
        type,
        mediaType,
        stream,
        audio
    ]);

}