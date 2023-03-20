import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../redux/teleconference";
import answerRingtone from "../../../../utils/answerRingtone";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";
import useJoinChannel from "../publish/useJoinChannel";
import useHandleCheckAvailability from "./useHandleCheckAvailability";
import useHandleHangUpCall from "./useHandleHangUpCall";
import useHandleOutgoing from "./useHandleOutgoing";
import useHandlePickUpCall from "./useHandlePickUpCall";

export default function useOutgoingCallAction () {
    useHandleOutgoing();
    useHandleCheckAvailability();
    useHandleHangUpCall();
    useHandlePickUpCall();
    const socket = useSocket();
    const onJoinChannel = useJoinChannel();
    const {mode, type, options, joined, modeId, mediaType} = useSelector(store => {
        const mode =  store.teleconference?.meetingMode;
        const type = store.teleconference?.type;
        const options = store.teleconference?.options;
        const joined = store.teleconference?.joined;
        const modeId = store.teleconference?.meetingId;
        const mediaType = store.teleconference?.mediaType;
        return {mode, type, options, joined, modeId, mediaType};
    });
    const [{localTracks, audio, timers}] = useTeleconference();
    const dispatch = useDispatch();
    const details = useMemo(() => 
        ({options, mediaType, id: modeId, type}),
        [options, mediaType, type, modeId]
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
                    target: modeId,
                    type,
                });
            } else {
                timers.forEach(timer => window.clearTimeout(timer));
                // ringtone = answerRingtone({type: 'end-call', audio});
                //     dispatch(addTeleconference({
                //         key: 'data',
                //         data: {
                //             response: 'error',
                //             error: 'call',
                //             privileged: false,
                //         }
                //     }));
                //ringtone.loop = false;
            }
        }
        if(allowJoin) onJoinChannel(handleCall);
    }
    } ,[socket, mode, onJoinChannel, details, allowJoin, modeId, type]);
}