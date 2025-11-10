import { useMemo } from 'react';
import { useRemoteUsers } from 'agora-rtc-react';
import { useSelector } from 'react-redux';

const useSharedScreensParticipants = () => {
  const bulkParticipants = useSelector(
    (store) => store.conference.meeting.participants
  );
  const participants = useMemo(
    () =>
      Object.values(bulkParticipants).filter(({ state }) => state?.isInRoom),
    [bulkParticipants]
  );
  const remoteUsers = useRemoteUsers();

  const sharedScreensParticipants = useMemo(() => {
    const active = [];
    for (let p of participants) {
      const found = remoteUsers.find(
        (u) => u.uid === p.screeId && p.state.screenShared
      );
      if (found) active.push(p);
    }
    return active;
  }, [participants, remoteUsers]);

  return sharedScreensParticipants;
};

export default useSharedScreensParticipants;
