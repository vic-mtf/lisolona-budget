import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { /*addTeleconference,*/ initializeState } from "../../../../redux/teleconference";
import answerRingtone from "../../../../utils/answerRingtone";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";

export default function useHandleHangUpCall () {
    const dispatch = useDispatch();
    const socket = useSocket();
    const {mode, error, type} = useSelector(store => {
        const mode = store.teleconference?.meetingMode;
        const error = store.teleconference?.error;
        const type = store.teleconference?.type;
        return {mode, error, type};
    });
    const [{audio, timers}] = useTeleconference();
    useEffect(() => {
        let ringtone;
        const handleHangUpCall = ({details}) => {   
            if(mode === 'incoming') {
                const {response} = details;
                switch(response) {
                    case 'stop':
                        timers.forEach(timer => window.clearTimeout(timer));
                        audio.src = null;
                        dispatch(initializeState());
                        break;
                    default: break;
                }
            }
            if(mode === 'on' && type === 'direct') {
                const {response} = details;
                switch(response) {
                    case 'end':
                        timers.forEach(timer => window.clearTimeout(timer));
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
        return () => {
            socket?.off('hang-up', handleHangUpCall);
        }
    },[dispatch, socket, mode, audio, error, timers]);
}