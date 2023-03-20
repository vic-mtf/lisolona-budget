import useOutgoingCallAction from "./outgoing/useOutgoingCallAction";
import React from "react";
import CallActionResponse from "./response/CallActionResponse";
import useCreateTracks from "./tracks/useCreateTracks";
import useInComingCallAction from "./incoming/useInComingCallAction";
import useUserPublishedAction from "./publish/useUserPublishedAction";

export default function ActionsWrapper ({children}) {
    useOutgoingCallAction();
    useInComingCallAction();
    useCreateTracks();
    useUserPublishedAction()

    return (
        <React.Fragment>
          <CallActionResponse/>
          {children}
        </React.Fragment>
    );
}