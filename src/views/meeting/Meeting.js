import MeetingProvider from "../../utils/MeetingProvider";
import CallEntry from "./call-entry/CallEntry";
import { useSelector } from "react-redux";
import PrepareDevice from "./prepare-device/PrepareDevice";
import ActionsWrapper from "./actions/ActionsWrapper";
import { useCallback } from "react";
import Conference from "./conference/conference";

export default function Meeting () {
    const mode = useSelector(store => store.meeting.mode);
    const show = useCallback((...states) => states.includes(mode), [mode]);
  
    return (
        <MeetingProvider>
            {show('outgoing', 'incoming') && <CallEntry/>}
            {show('prepare') && <PrepareDevice/>}
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