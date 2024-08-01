import { createContext, useCallback, useMemo } from "react";
// import eliminateDuplicatesByKey from "../utils/filterByKey";

export default function LocalStoreDataProvider({ children }) {
  const data = useMemo(
    () => ({
      messages: {},
      meetingMessages: [],
      meetingCode: null,
      secretCode: (Date.now() * 17913).toString(16),
      downloads: [],
      voices: [],
      videos: [],
      audioStream: null,
      videoStream: null,
      screenStream: null,
    }),
    []
  );

  const setData = useCallback(
    (key, callback) => {
      if (key !== undefined && key !== null)
        data[key] =
          typeof callback === "function" ? callback(data[key], key) : callback;
    },
    [data]
  );

  // const pushMessages = ({ id, messages, total }) =>
  //   (messagesRef.current[id] = { messages, total });

  // const updateMessages = ({ id, messages }) => {
  //   const oldMessages = messagesRef.current[id];
  //   const newMessages = eliminateDuplicatesByKey("id", oldMessages, messages);
  //   pushMessages({
  //     id,
  //     messages: newMessages,
  //     total: newMessages.length,
  //   });
  // };

  return <Provider value={[data, setData]}>{children}</Provider>;
}

export const LocalStoreDataContext = createContext();

const { Provider } = LocalStoreDataContext;
