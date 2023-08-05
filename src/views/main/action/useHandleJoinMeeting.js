import { useCallback } from "react";
import { useDispatch } from "react-redux";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useSocket } from "../../../utils/SocketIOProvider";
import { useData } from "../../../utils/DataProvider";

export default function useHandleJoinMeeting () {
    const dispatch = useDispatch();
    const socket = useSocket();
    const [{secretCodeRef}] = useData();

    const handleJoinMeeting = useCallback(({timer, data:target, origin}) => {
        window.clearInterval(timer);
        const mode = 'prepare';
        const wd = openNewWindow({
            url: '/meeting/',
        });
        
        wd.geidMeetingData = encrypt({
            target,
            mode,
            secretCode: secretCodeRef.current,
            defaultCallingState: 'incoming',
            origin
        });
        if(wd) {
            dispatch(setData({ data: {mode}}));
            wd.openerSocket = socket;
        }
    },[dispatch, socket, secretCodeRef]);
    return handleJoinMeeting;
}

