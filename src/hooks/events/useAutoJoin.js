import { useEffect, useRef } from 'react';
import useSocket from '../useSocket';
import store from '../../redux/store';

const useAutoJoin = () => {
  const socket = useSocket();
  const disconnectedRef = useRef(false);

  useEffect(() => {
    const disconnect = () => {
      console.log('server disconnected !');
      disconnectedRef.current = true;
    };

    const connect = () => {
      // console.log("server connected !");
      const conference = store.getState().conference;
      const userId = store.getState().user.id;
      const participant = conference.meeting.participants[userId];
      if (!participant?.state?.isInRoom && !disconnectedRef.current) return;
      const id = conference.roomId;
      disconnectedRef.current = false;
      socket?.emit('join-room', { id });
    };

    socket?.on('connect', connect);
    socket?.on('disconnect', disconnect);
    return () => {
      socket?.off('disconnect', disconnect);
      socket?.off('connect', connect);
    };
  });
};
export default useAutoJoin;
