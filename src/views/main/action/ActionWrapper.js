import useDispatchMessageNewMessage from "./useDispatchMessageNewMessage";
import useGetNewMessage from "./useGetNewMessage";
import useLiveUpdateMessages from "./useLiveUpdateMessages";

export default function ActionWrapper () {
    useGetNewMessage();
    useLiveUpdateMessages();
    useDispatchMessageNewMessage();
    return null;
}