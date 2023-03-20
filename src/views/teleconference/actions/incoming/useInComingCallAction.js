import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTeleconference } from "../../../../utils/TeleconferenceProvider";
import useJoinChannel from "../publish/useJoinChannel";
import useHandleHangUpCall from "./useHandleHangUpCall";
import useHandleIncomingCall from "./useHandleIncomingCall";

export default function useInComingCallAction () {
    useHandleIncomingCall();
    useHandleHangUpCall();
    const {mode, options, joined} = useSelector(store => {
        const mode = store.teleconference?.meetingMode;
        const options = store.teleconference?.options;
        const joined = store.teleconference?.joined;
        return {mode, options, joined};
    });
    const onJoinChannel = useJoinChannel();
    const [{localTracks}] = useTeleconference();

    useEffect(() => {
        if(mode === 'incoming') 
           if(localTracks && options && !joined) 
                onJoinChannel();
    } ,[options, localTracks, joined, mode, onJoinChannel]);

}