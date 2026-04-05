import { useMemo } from "react";
import { useContext, createContext } from "react";
import { useSelector } from "react-redux";

export const MessagingContext = createContext(null);

export const useSelectorMessage = (id, keys) => {
  const k = useMemo(
    () => (Array.isArray(keys) ? keys : keys?.split(".")),
    [keys]
  );
  const [{ user }] = useMessagingContext();

  return useSelector((store) => {
    const data = store.data.app.messages[user?.id]?.find(
      ({ clientId }) => clientId === id
    );
    return k.reduce((acc, key) => acc?.[key], data);
  });
};

const useMessagingContext = () => useContext(MessagingContext);
export default useMessagingContext;
