import useListenRemoteUserStatus from "../hooks/events/useListenRemoteUserStatus";
import useNewChat from "../hooks/events/useNewChat";
import useNewMessage from "../hooks/events/useNewMessage";
import useNewInvitations from "../hooks/events/useNewInvitations";
import useNewContacts from "../hooks/events/useNewContacts";
import useNetworkStat from "../hooks/events/useNetworkStat";
import useBroadcastCall from "../hooks/events/useBroadcastCall";

export default function InboundUpdateEventDetector() {
  useListenRemoteUserStatus();
  useNewMessage();
  useNewChat();
  useNewInvitations();
  useNewContacts();
  useNetworkStat();
  useBroadcastCall();
  return null;
}
