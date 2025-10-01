import { useSelector } from "react-redux";

const useIsOrganizer = (userId) => {
  const id = useSelector((state) => state.user.id);
  const isAdmin = useSelector(
    (store) =>
      store.conference.meeting.participants?.[userId || id]?.state?.isOrganizer
  );
  return Boolean(isAdmin);
};

export default useIsOrganizer;
