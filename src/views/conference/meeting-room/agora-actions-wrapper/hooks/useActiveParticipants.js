import { useMemo } from "react";
import { useRemoteUsers } from "agora-rtc-react";
import { useSelector } from "react-redux";

const useActiveParticipants = () => {
  const bulkParticipants = useSelector(
    (store) => store.conference.meeting.participants
  );
  const participants = useMemo(
    () =>
      Object.values(bulkParticipants).filter(({ state }) => state?.isInRoom),
    [bulkParticipants]
  );
  const remoteUsers = useRemoteUsers();
  const activeParticipants = useMemo(() => {
    const active = [];
    for (let p of participants) {
      const found = remoteUsers.find((u) => u.uid === p.uid);
      if (found) active.push(p);
    }
    return active;
  }, [participants, remoteUsers]);

  return activeParticipants;
};

export default useActiveParticipants;
