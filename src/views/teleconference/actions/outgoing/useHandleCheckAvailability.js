import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTeleconference } from "../../../../redux/teleconference";
import answerRingtone from "../../../../utils/answerRingtone";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";

export default function useHandleCheckAvailability () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const [{audio, timers}] = useTeleconference();

    useEffect(() => {
        let ringtone, data;
        const handleCheckAvailability = ({connected}) => {
            timers.forEach(timer => window.clearTimeout(timer));
            if(connected) {
                ringtone = answerRingtone({type: 'outgoing', audio});
                data = {response: 'ringing'};
                const timer = window.setTimeout(() => {
                    timers.forEach(timer => window.clearTimeout(timer));
                    ringtone = answerRingtone({type: 'end-call', audio});
                    data = {
                        response: 'unanswered',
                        error: 'timeout',
                        privileged: false,
                    }
                    dispatch(addTeleconference({key: 'data', data}));
                }, 40000);
                timers.push(timer);
            } else {
                ringtone = answerRingtone({type: 'end-call', audio});
                data = {response: 'disconnected', error: 'offline'};
                timers.forEach(timer => window.clearTimeout(timer));
            }
            dispatch(addTeleconference({key: 'data', data}));
        };
        socket?.on('call-in-progress', handleCheckAvailability);
        return () => {
            socket?.off('incoming-call', handleCheckAvailability);
        }
    }, [socket, dispatch, audio]);
}
