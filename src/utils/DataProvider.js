import { createContext, useContext, useMemo, useRef } from "react";
import AgoraRTC from "agora-rtc-react";
import eliminateDuplicatesByKey from "./filterByKey";

const Data = createContext();
export const useData = () => useContext(Data);

export default function DataProvider({ children }) {
  const app = useMemo(
    () => ({
      messages: {},
      meetingMessages: [],
      downloads: [],
      voices: [],
      videos: [],
      audioStream: null,
      videoStream: null,
      screenStream: null,
    }),
    []
  );
  const messagesRef = useRef({});
  const meetingMessagesRef = useRef([]);
  const downloadsRef = useRef([]);
  const voicesRef = useRef([]);
  const videosRef = useRef([]);
  const audioStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const videoStreamRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const secretCode = useMemo(() => (Date.now() * 17913).toString(16), []);
  const client = useMemo(
    () => AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }),
    []
  );
  const pushMessages = ({ id, messages, total }) =>
    (messagesRef.current[id] = { messages, total });

  const updateMessages = ({ id, messages }) => {
    const oldMessages = messagesRef.current[id];
    const newMessages = eliminateDuplicatesByKey("id", oldMessages, messages);
    pushMessages({
      id,
      messages: newMessages,
      total: newMessages.length,
    });
  };

  const values = [
    {
      app,
      messagesRef,
      downloadsRef,
      voicesRef,
      videosRef,
      audioStreamRef,
      videoStreamRef,
      screenStreamRef,
      mediaStreamRef,
      secretCode,
      meetingMessagesRef,
      client,
      streams: [
        audioStreamRef,
        videoStreamRef,
        screenStreamRef,
        mediaStreamRef,
      ],
    },
    {
      pushMessages,
      updateMessages,
    },
  ];
  return <Data.Provider value={values}>{children}</Data.Provider>;
}
