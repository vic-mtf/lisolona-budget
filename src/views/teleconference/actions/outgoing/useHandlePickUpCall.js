import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../redux/teleconference";
import { useSocket } from "../../../../utils/SocketIOProvider";
import usePublishLocalTracks from "../publish/usePublishLocalTracks";

export default function useHandlePickUpCall () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const {mode} = useSelector(store => {
        const mode =  store.teleconference?.meetingMode;
        return {mode};
    });
    const onPublishLocalTracks = usePublishLocalTracks();
    useEffect(() => {
        const handlePickUpCall = ({who}) => {
            if(mode === 'outgoing') { 
                dispatch(addTeleconference({
                    key: 'data',
                    data: {
                        meetingMode: 'on',
                        videoMirrorMode: 'float',
                    }
                }));
                onPublishLocalTracks();
            }
        };
        socket?.on('pick-up', handlePickUpCall);
        return () => {
            socket?.off('pick-up', handlePickUpCall);
        }
    }, [socket, dispatch, mode, onPublishLocalTracks]);
}
