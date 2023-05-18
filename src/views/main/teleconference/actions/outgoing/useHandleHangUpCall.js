import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference, initializeState } from "../../../../../redux/teleconference";
import answerRingtone from "../../../../../utils/answerRingtone";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useHandleHangUpCall () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const mode = useSelector(store => store.teleconference?.mode);
    const target = useSelector(store => store.teleconference?.target);
    const [{audio, timers}] = useTeleconference();
    
    useEffect(() => {
        let ringtone, data;
        const handleHangUpCall = ({details}) => {
            if(mode === 'outgoing' && target?.type === "direct") {
                const {response} = details;
                switch(response) {
                    case 'unanswered':
                        timers.forEach(timer => window.clearTimeout(timer));
                        ringtone = answerRingtone({type: 'end-call', audio});
                        data = {error: 'timeout', response};
                        break;
                    case 'rejected':
                        timers.forEach(timer => window.clearTimeout(timer));
                        ringtone = answerRingtone({type: 'answering-machine', audio});
                        data = null;
                        ringtone.loop = false;
                        const timer = window.setTimeout(() => {
                            dispatch(initializeState({}));
                        }, 1000);
                        timers.push(timer);
                        break;
                    case 'busy':
                        data = {response};
                        ringtone = answerRingtone({type: 'busy', audio});
                        ringtone.loop = true;
                        break;
                    default: break;
                }
                if(data) dispatch(addTeleconference({data, key: 'data'}));
            }
        };
        socket?.on('hang-up', handleHangUpCall);
        return () => {
            socket?.off('hang-up', handleHangUpCall);
        }
    }, [socket, dispatch, audio, mode, target]);
}