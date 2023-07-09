import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import useJoinChannel from "../publish/useJoinChannel";
import useHandleCheckAvailability from "./useHandleCheckAvailability";
import useHandleHangUpCall from "./useHandleHangUpCall";
import useHandleOutgoing from "./useHandleOutgoing";
import useHandlePickUpCall from "./useHandlePickUpCall";
import { addTeleconference } from "../../../../../redux/teleconference";
import answerRingtone from "../../../../../utils/answerRingtone";

export default function useOutgoingCallAction () {
    useHandleOutgoing();
    useHandleCheckAvailability();
    useHandleHangUpCall();
    useHandlePickUpCall();
    const socket = useSocket();
    const onJoinChannel = useJoinChannel();
    const options = useSelector(store => store.teleconference?.options);
    const mode = useSelector(store => store.teleconference?.mode);
    const joined = useSelector(store => store.teleconference?.joined);
    const mediaType = useSelector(store => store.teleconference?.mediaType);
    const data = useSelector(store => store.teleconference?.target);
    const [{localTracks, timers, audio}] = useTeleconference();
    const dispatch = useDispatch();
    const details = useMemo(() => 
        ({options, mediaType, data}),
        [options, mediaType, data]
    );
    const allowJoin = useMemo(() => 
        localTracks && options && !joined ,
        [localTracks, options, joined]
    );

    useEffect(() => {
        if(mode === 'outgoing') {
        let ringtone;
        const handleCall = (status, agoraEngine) => {
            if(status === 'success') {
                socket?.emit('call', {
                    details,
                    target: details?.data?.id,
                    type: details?.data?.type,
                });
            } else {
                timers.forEach(timer => window.clearTimeout(timer));
                // ringtone = answerRingtone({type: 'end-call', audio});
                //     dispatch(addTeleconference({
                //         key: 'data',
                //         data: {
                //             response: 'error',
                //             error: 'call',
                //         }
                //     }));
                // ringtone.loop = false;
            }
        }
        if(allowJoin) onJoinChannel(handleCall);
    }
    } ,[socket, mode, onJoinChannel, details, allowJoin]);
}