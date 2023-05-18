import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference, initializeState } from "../../../../../redux/teleconference";
import answerRingtone from "../../../../../utils/answerRingtone";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import useJoinChannel from "../publish/useJoinChannel";
import useHandleHangUpCall from "./useHandleHangUpCall";
import useHandleIncomingCall from "./useHandleIncomingCall";

export default function useInComingCallAction () {
    useHandleIncomingCall();
    useHandleHangUpCall();
    const mode = useSelector(store => store.teleconference?.mode);
    const socket = useSocket();
    const options = useSelector(store => store.teleconference?.options);
    const joined = useSelector(store => store.teleconference?.joined);
    const target = useSelector(store => store.teleconference?.target);
    const callId = useSelector(store => store.teleconference?.callId);
    const from = useSelector(store => store.teleconference?.from);
    const onJoinChannel = useJoinChannel();
    const dispatch = useDispatch();
    const [{localTracks, audio, timers}] = useTeleconference();
    const reached = useMemo(() =>
        mode === 'incoming' && localTracks && !joined && options,
     [mode, localTracks, joined, options]);

    useEffect(() => {
        let ringtone;
        const handleJoinChannel = () => {
            ringtone = answerRingtone({type: 'incoming', audio});
            dispatch(addTeleconference({
                key: 'data',
                data: {screen: 'full'}
            }));
            ringtone.loop = true;
            timers.push(window.setTimeout(() => {
                timers.forEach(timer => window.clearTimeout(timer));
                socket.emit('hang-up', {
                    from: target?.type === 'direct' ? from?.id : target?.id, 
                    type: target?.type,
                    details: {response: 'unanswered'},
                    callId
                });
                ringtone.src = null;
                dispatch(initializeState());
            }, 30000));
        };
        if(reached) 
                onJoinChannel(handleJoinChannel)
    } ,[
        onJoinChannel, 
        dispatch, 
        audio, 
        socket, 
        timers,
        reached,
        callId
    ]);

}