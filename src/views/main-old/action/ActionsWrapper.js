import useDirectCall from "./useDirectCall";
import useRoomCall from "./useRoomCall";
import useCallChannel from "./useCallChannel";
import useScheduledMeeting from "./useScheduledMeeting";

export default function ActionsWrapper () {
    useDirectCall();
    useRoomCall();
    useCallChannel();
    useScheduledMeeting();
    return null;
}