import useListenRemoteUserStatus from "../hooks/events/useListenRemoteUserStatus";
import useNewChat from "../hooks/events/useNewChat";
import useNewMessage from "../hooks/events/useNewMessage";
import useNewInvitations from "../hooks/events/useNewInvitations";
import useNewContacts from "../hooks/events/useNewContacts";
import { useNetworkStatDemo } from "../hooks/events/useNetworkStat";

export default function InboundUpdateEventDetector() {
  useListenRemoteUserStatus();
  useNewMessage();
  useNewChat();
  useNewInvitations();
  useNewContacts();
  useNetworkStatDemo();
  return null;
}
