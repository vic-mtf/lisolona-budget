import { useLayoutEffect } from "react";
import useSocket from "../../../hooks/useSocket";
import openNewWindow from "../../../utils/openNewWindow";
import { encrypt } from "../../../utils/crypt";
import { setData } from "../../../redux/meeting";
import { useDispatch, useSelector } from "react-redux";

import useAxios from "../../../hooks/useAxios";
import store from "../../../redux/store";
import getFullName from "../../../utils/getFullName";
import song_src from "../../../assets/Halloween-Cradles.webm";
import useAudio from "../../../hooks/useAudio";

export default function useDirectCall() {
  const socket = useSocket();
  const [{ secretCode }] useLocalStoreData();
  const token = useSelector((store) => store.user.token);
  const [, refetch] = useAxios(
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    { manual: true }
  );
  const dispatch = useDispatch();
  const songAudio = useAudio(song_src);

  useLayoutEffect(() => {
    const handleCall = (event) => {
      const mode = store.getState().meeting.mode;
      const user = event.who;
      const id = event?.where?._id;
      const url = "/api/chat/room/call/" + id;
      const type = event.where.type;
      const target = {
        id: user._id,
        name: getFullName(user),
        type: "direct",
        avatarSrc: user?.imageUrl,
      };

      if (mode === "none") {
        if (type === "direct") {
          refetch({ url }).then(async ({ data: origin }) => {
            const subWindow = openNewWindow({
              url: "/meeting",
            });
            if (subWindow) {
              subWindow.geidMeetingData = encrypt({
                mode: "incoming",
                target,
                secretCode: secretCode,
                defaultCallingState: "incoming",
                origin,
              });
              dispatch(setData({ data: { mode: "incoming" } }));
              subWindow.openerSocket = socket;
              subWindow.openerSongAudio = songAudio;
            }
          });
        }
      } else {
        let counter = 0;
        const timer = setInterval(() => {
          counter += 1;
          if (store.getState().meeting.mode !== "none")
            socket.emit("busy", {
              id,
              type: target?.type,
              target: target?.id,
            });
          if (counter === 20) window.clearInterval(timer);
        }, 1000);
        const handleHangUp = () => {
          window.clearInterval(timer);
          socket.off("hang-up", handleHangUp);
        };
        socket.on("hang-up", handleHangUp);
      }
    };
    socket?.on("call", handleCall);
    return () => {
      socket?.off("call", handleCall);
    };
  }, [socket, secretCode, dispatch, refetch, songAudio]);
}