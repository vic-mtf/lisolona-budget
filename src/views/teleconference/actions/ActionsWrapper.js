import useOutgoingCallAction from "./useOutgoingCallAction";
import useInComingCallAction from "./useInComingCallAction";
import React from "react";
import CallActionResponse from "./CallActionResponse";
import useCreateStream from "./useCreateStream";
import { useTeleconference } from "../../../utils/TeleconferenceProvider";
import useUserPublishedAction from "./useUserPublishedAction";

export default function ActionsWrapper ({children}) {
    const [{stream}] = useTeleconference();
    useOutgoingCallAction();
    useInComingCallAction();
    useCreateStream();
    useUserPublishedAction();

    return ( stream &&
        <React.Fragment>
          <CallActionResponse/>
          {children}
        </React.Fragment>
    );
}