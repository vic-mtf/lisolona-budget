import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import answerRingtone from "../../../../../utils/answerRingtone";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useHandleCheckAvailability () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const [{audio, timers}] = useTeleconference();

    useEffect(() => {
        
        const handleCheckAvailability = ({connected, callId}) => {
            let ringtone, data;
            timers.forEach(timer => window.clearTimeout(timer));
            if(connected) {
                ringtone = answerRingtone({type: 'outgoing', audio});
                data = {response: 'ringing', callId};
                const timer = window.setTimeout(() => {
                    timers.forEach(timer => window.clearTimeout(timer));
                    ringtone = answerRingtone({type: 'end-call', audio});
                    data = {
                        response: 'unanswered',
                        error: 'timeout',
                    }
                    dispatch(addTeleconference({key: 'data', data}));
                }, 40000);
                timers.push(timer);
            } else {
                ringtone = answerRingtone({type: 'end-call', audio});
                data = {response: 'disconnected', error: 'offline'};
                timers.forEach(timer => window.clearTimeout(timer));
                ringtone.loop = false;
            }
            dispatch(addTeleconference({key: 'data', data}));
        };
        socket?.on('call-in-progress', handleCheckAvailability);
        return () => {
            socket?.off('call-in-progress', handleCheckAvailability);
        }
    }, [socket, dispatch, audio, timers]);
}
