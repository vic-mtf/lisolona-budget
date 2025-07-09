import useListenRemoteUserStatus from "../hooks/events/useListenRemoteUserStatus";
import useNewChat from "../hooks/events/useNewChat";
import useNewMessage from "../hooks/events/useNewMessage";

export default function InboundUpdateEventDetector() {
  useListenRemoteUserStatus();
  useNewMessage();
  useNewChat();
  return null;
}
