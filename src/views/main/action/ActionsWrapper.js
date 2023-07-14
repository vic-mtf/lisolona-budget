import useDirectCall from "./useDirectCall";
import useRoomCall from "./useRoomCall";
import useCallChannel from "./useCallChannel";

export default function ActionsWrapper () {
    useDirectCall();
    useRoomCall();
    useCallChannel();
    return null;
}