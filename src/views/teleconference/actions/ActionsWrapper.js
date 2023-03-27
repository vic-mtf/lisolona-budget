import useOutgoingCallAction from "./outgoing/useOutgoingCallAction";
import React from "react";
import CallActionResponse from "./response/CallActionResponse";
import useCreateTracks from "./tracks/useCreateTracks";
import useInComingCallAction from "./incoming/useInComingCallAction";
import useUserPublishedAction from "./publish/useUserPublishedAction";
import useUserRaiseHand from "./users/useUserRaiseHand";

export default function ActionsWrapper ({children}) {
    useOutgoingCallAction();
    useInComingCallAction();
    useCreateTracks();
    useUserPublishedAction();
    useUserRaiseHand();

    return (
        <React.Fragment>
          <CallActionResponse/>
          {children}
        </React.Fragment>
    );
}