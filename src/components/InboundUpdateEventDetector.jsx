import useListenRemoteUserStatus from "../hooks/events/useListenRemoteUserStatus";
import useNewMessage from "../hooks/events/useNewMessage";

export default function InboundUpdateEventDetector() {
  useListenRemoteUserStatus();
  useNewMessage();
  return null;
}
