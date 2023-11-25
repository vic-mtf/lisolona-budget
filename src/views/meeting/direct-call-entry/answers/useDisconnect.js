import { useLayoutEffect, useRef } from "react";
import { useSocket } from "../../../../utils/SocketIOProvider";
import useAudio from "../../../../utils/useAudio";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import error_src from '../../../../assets/computer-error.aac';import { useDispatch } from "react-redux";
import { setCameraData } from "../../../../redux/meeting";
import { useData } from "../../../../utils/DataProvider";
;

export default function useDisconnect(callState, setCallState) {
    const socket = useSocket();
    const erroryAudio = useAudio(error_src);
    const [{client}] = useData();
    const [{ringRef}] = useMeetingData();
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const handleOffline = async () => {
            if(callState === 'waiting') {
                ringRef.current?.clearAudio();
                ringRef.current = erroryAudio;
                erroryAudio.audio.play();
                setCallState('disconnect');
                await client.leave();
                dispatch(setCameraData({data: {active: false}}));
                setTimeout(() => {
                    if(window.opener) window.close();
                }, 2000);
            }
        };
        socket.on('disconnected', handleOffline);
        return () => {
            socket.off('disconnected', handleOffline);;
        };
    }, [
        socket, 
        callState, 
        setCallState, 
        ringRef, 
        erroryAudio
    ]);

}