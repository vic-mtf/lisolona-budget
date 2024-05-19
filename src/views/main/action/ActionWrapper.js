import useDispatchMessageNewMessage from "./useDispatchMessageNewMessage";
import useGetNewMessage from "./useGetNewMessage";
import useLiveUpdateMessages from "./useLiveUpdateMessages";

export default function ActionWrapper ({ targetId }) {
    useGetNewMessage();
    useLiveUpdateMessages();
    useDispatchMessageNewMessage({targetId});
    return null;
}