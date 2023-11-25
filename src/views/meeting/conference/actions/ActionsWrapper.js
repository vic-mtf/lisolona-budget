import useClientJoin from "./useClientJoin";
import useClientSignalHandRaised from "./useClientSignalHandRaised";
import useCreateLocalTracks from "./useCreateLocalTracks";
import useMeetingEnd from "./useMeetingEnd";
import useSignalClientGuest from "./useSignalClientGuest";
import useSignalUpdate from "./useSignalUpdate";

export default function ActionsWrapper () {
    useMeetingEnd();
    useCreateLocalTracks();
    useClientJoin();
    useSignalClientGuest();
    useSignalUpdate();
    useClientSignalHandRaised()
    return null;
}