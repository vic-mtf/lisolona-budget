import useOutgoingCallAction from "./outgoing/useOutgoingCallAction";
import React from "react";
import CallActionResponse from "./response/CallActionResponse";
import useCreateTracks from "./tracks/useCreateTracks";
import useInComingCallAction from "./incoming/useInComingCallAction";
import useUserPublishedAction from "./publish/useUserPublishedAction";
import useUserRaiseHand from "./users/useUserRaiseHand";
import useRoomSignalMeetting from "./users/useRoomSignalMeetting";
import useUserJoinChannelAction from "./publish/useUserJoinChannelAction";
import useUserJoinMeeting from "./users/useUserJoinMeeting";

export default function ActionsWrapper ({children}) {
    useOutgoingCallAction();
    useInComingCallAction();
    useCreateTracks();
    useUserPublishedAction();
    useUserJoinChannelAction();
    useUserRaiseHand();
    useRoomSignalMeetting();
    useUserJoinMeeting();
    return (
        <React.Fragment>
          <CallActionResponse/>
          {children}
        </React.Fragment>
    );
}