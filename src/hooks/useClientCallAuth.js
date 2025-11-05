import { useSelector } from 'react-redux';

/**
 * @param {string} id
 * @param {"controlAuthorization" | "shareScreen" | "writeMessage" | "allowPrivateMessage" | "react" | "activateCam"  | "activateMic"} prop
 * @returns {boolean|undefined}
 */

const useClientCallAuth = (id, prop) => {
  const val = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.auth?.[prop]
  );
  return val;
};

export default useClientCallAuth;
