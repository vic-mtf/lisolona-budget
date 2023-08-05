import useClientJoin from "./useClientJoin";
import useClientSignalHandRaised from "./useClientSignalHandRaised";
import useCreateLocalTracks from "./useCreateLocalTracks";
import useMeetingEnd from "./useMeetingEnd";
import useSignalUpdate from "./useSignalUpdate";

export default function ActionsWrapper () {
    useMeetingEnd();
    useCreateLocalTracks();
    // useClientJoin();
    useSignalUpdate();
    useClientSignalHandRaised()
    return null;
}