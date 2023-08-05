import MeetingProvider from "../../utils/MeetingProvider";
import { useSelector } from "react-redux";
import ActionsWrapper from "./actions/ActionsWrapper";
import { useCallback } from "react";
import Conference from "./conference/conference";
import DirectCallEntry from "./direct-call-entry/DirectCallEntry";
import RoomCallEntry from "./room-call-entry/RoomCallEntry";

export default function Meeting () {
    const mode = useSelector(store => store.meeting.mode);
    const show = useCallback((...states) => states.includes(mode), [mode]);

    return (
        <MeetingProvider>
            {show('outgoing', 'incoming') && <DirectCallEntry/>}
            {show('prepare') && <RoomCallEntry/>}
            {show('join', 'on') && <Conference/>}
            <ActionsWrapper/> 
        </MeetingProvider>
    )
}

const openChannel = new BroadcastChannel('_geid_meeting_window_channel');

window.onload = () => {
   if(window.opener)
        openChannel.postMessage({
                type: 'opening',
                state: true,
            },
            window.location.origin
        );
};

window.onbeforeunload = event => {
    if(window.opener) {
        openChannel.postMessage({
                type: 'opening',
                state: false,
            },
            window.location.origin
        );
    }
};