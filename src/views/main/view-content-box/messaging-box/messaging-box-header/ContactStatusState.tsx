import useListenRemoteUserStatus from "@/hooks/events/useListenRemoteUserStatus";
import { timeElapses } from "@/utils/formatDate";

export default function ContactStatusState({ id }) {
  const status = useListenRemoteUserStatus(id);
  return status === "loading"
    ? "Changement..."
    : status === "online"
    ? "en ligne"
    : "en ligne " + timeElapses({ date: status })?.toLocaleLowerCase();
}
