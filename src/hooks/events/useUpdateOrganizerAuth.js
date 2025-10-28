import { useDispatch } from 'react-redux';
import useSocket from '../useSocket';
import { useEffect } from 'react';

const useUpdateOrganizerAuth = () => {
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpdateOrganizerAuth = (data) => {
      dispatch({
        type: 'conference/updateConferenceData',
        payload: {
          data: {
            meeting: { organizerAuth: data },
          },
        },
      });
    };
    socket?.on('update-auth-room', handleUpdateOrganizerAuth);
    return () => {
      socket?.off('update-auth-room', handleUpdateOrganizerAuth);
    };
  }, [socket, dispatch]);
};

export default useUpdateOrganizerAuth;
//2bc8feb80
