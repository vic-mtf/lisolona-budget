import useCall from "./useCall";
import useCallChannel from "./useCallChannel";

export default function ActionsWrapper () {
    useCall();
    useCallChannel();
    return null;
}