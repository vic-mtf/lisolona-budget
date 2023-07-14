import useClientJoin from "./useClientJoin";
import useCreateLocalTracks from "./useCreateLocalTracks";
import useMeetingEnd from "./useMeetingEnd";

export default function ActionsWrapper () {
    useMeetingEnd();
    useCreateLocalTracks();
    useClientJoin()
    return null;
}