import useGetNewMessage from "./useGetNewMessage";
import useLiveUpdateMessages from "./useLiveUpdateMessages";

export default function ActionWrapper () {
    useGetNewMessage();
    useLiveUpdateMessages();
    return null;
}