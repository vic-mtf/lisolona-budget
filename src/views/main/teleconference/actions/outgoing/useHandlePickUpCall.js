import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import { useSocket } from "../../../../../utils/SocketIOProvider";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";
import usePublishLocalTracks from "../publish/usePublishLocalTracks";

export default function useHandlePickUpCall () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const [{timers, audio}] = useTeleconference();
    const mode = useSelector(store => store.teleconference?.mode);
    const onPublishLocalTracks = usePublishLocalTracks();
    useEffect(() => {
        const handlePickUpCall = ({who}) => {
                dispatch(addTeleconference({
                    key: 'data',
                    data: {
                        mode: 'on',
                        videoMirrorMode: 'float',
                        date: (new Date()).toString(),
                    }
                }));
                timers.forEach(timer => window.clearTimeout(timer));
                audio.src = null;
                onPublishLocalTracks();
        };
        if(mode === 'outgoing')
            socket?.on('pick-up', handlePickUpCall);
        return () => {
            socket?.off('pick-up', handlePickUpCall);
        }
    }, [socket, dispatch, mode, onPublishLocalTracks, timers, audio]);
}
