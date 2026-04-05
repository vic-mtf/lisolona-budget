import { useSelector } from 'react-redux';

/**
 * @param {string} id
 * @param {"isActiveMic"|"isActiveCam"|"handRaised"|"isInRoom"|"isOrganizer"} prop
 * @returns {boolean|undefined}
 */
const useClientCallState = (id, prop) =>
  useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.[prop]
  );

export default useClientCallState;
