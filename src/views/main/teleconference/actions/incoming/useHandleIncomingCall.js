import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /*addTeleconference,*/ initializeState } from "../../../../../redux/teleconference";
// import answerRingtone from "../../../../utils/answerRingtone";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useHandleIncomingCall () {
    const dispatch = useDispatch();
    const socket = useSocket();
    const mode = useSelector(store => store.teleconference?.mode);
    const error = useSelector(store => store.teleconference?.error);
    const [{audio, timers}] = useTeleconference();

    useEffect(() => {
        let ringtone, params;
        const handleIncomingCall = ({from: _from, details, room, callId}) => {
           const {mediaType, options, data} = details;
           const from  = {
            ..._from,
            id: _from?._id,
            name: `${_from?.fname || ''} ${_from?.lname || ''} ${_from?.mname || ''}`.trim(),
            avatarSrc: _from?.imageUrl,
           }
            if(mode === 'none' || error) {
                params = {
                    data: {
                        mode: 'incoming',
                        video: mediaType === 'video',
                        audio: true,
                        mediaType,
                        videoMirrorMode: 'grid',
                        response: 'incoming',
                        options,
                        from,
                        callId,
                        target: data,
                    },
                    key: 'data',
                };
                dispatch(initializeState(params));
            } else {
                socket.emit('hang-up', {
                    from: from?.id, 
                    type: 'direct',
                    details: {response: 'busy'},
                    callId
                });
                // Signalisation... un nouveau appel
            }
        };
        socket?.on('incoming-call', handleIncomingCall);
        return () => {
            socket?.off('incoming-call', handleIncomingCall);
        }
    },[dispatch, socket, mode, audio, error, timers]);
}