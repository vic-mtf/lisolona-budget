import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /*addTeleconference,*/ initializeState } from "../../../../redux/teleconference";
import answerRingtone from "../../../../utils/answerRingtone";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";

export default function useHandleIncomingCall () {
    const dispatch = useDispatch();
    const socket = useSocket();
    const {mode, error} = useSelector(store => {
        const mode = store.teleconference?.meetingMode;
        const error = store.teleconference?.error;
        return {mode, error};
    });
    const [{audio, timers}] = useTeleconference();

    useEffect(() => {
        let ringtone, params;
        const handleIncomingCall = ({from: _from, details, room}) => {
            const {mediaType, type, id, options} = details;
            const from  = room ? id : _from?._id;
            if(mode === 'none' || error) {
                params = {
                    data: {
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
                        from
                    },
                    key: 'data'
                };
                dispatch(initializeState(params));
                ringtone = answerRingtone({type: 'incoming', audio});
                ringtone.loop = true;
                timers.push(window.setTimeout(() => {
                    timers.forEach(timer => window.clearTimeout(timer));
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
        socket?.on('incoming-call', handleIncomingCall);
        return () => {
            socket?.off('incoming-call', handleIncomingCall);
        }
    },[dispatch, socket, mode, audio, error, timers]);
}