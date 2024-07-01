import { useEffect } from "react";
import { useMeetingData } from "../../../../utils/MeetingProvider";
import { useSocket } from "../../../../utils/SocketIOProvider";
import store from "../../../../redux/store";
import structureMessageData from "../../../../database/structureMessageData";
import { MESSAGE_CHANNEL } from "../../../main/chat-box/ChatBox";
import deepMerge from "../../../../utils/mergeDeep";
import { useData } from "../../../../utils/DataProvider";

export default function useClientMessage() {
  const [{ target }] = useMeetingData();
  const socket = useSocket();
  const [{ meetingMessagesRef }] = useData();

  useEffect(() => {
    const name = "_submit-internal-message";

    const getDiscussion = () => {
      const participants = store
        .getState()
        .conference.participants.map(({ identity }) => identity);
      const type =
        target.type === "room" || participants.length > 2 ? "room" : "direct";
      const _id = store.getState().meeting.meetingId;
      return { participants, type, _id };
    };

    const handleSendMessage = (event) => {
      const content = event?.detail?.data?.HTML;
      const user = store.getState().meeting.me;
      const id = (Date.now() + 1).toString(16) + target.id;
      const discussion = getDiscussion();
      const message = {
        content,
        to: discussion?._id,
        date: new Date(),
        type: "room",
        clientId: id,
      };
      socket?.emit("call-message", message);
      message.type = "text";
      message.sender = {
        _id: user.id,
        name: user.name,
      };
      message.sended = false;
      const localMessage = structureMessageData({
        message,
        discussion,
      });
      meetingMessagesRef.current.push(localMessage);
      dispatchMessage(localMessage);
    };

    const dispatchMessage = (data) => {
      const name = "_new-message";
      const customEvent = new CustomEvent(name, {
        detail: {
          data,
          name,
        },
      });
      MESSAGE_CHANNEL.dispatchEvent(customEvent);
    };

    const handleGetMessage = ({ message, where }) => {
      let localMessage;
      const discussion = getDiscussion();
      if (where?._id === discussion?._id) {
        const index = meetingMessagesRef.current.findIndex(
          ({ id }) => id === message.clientId
        );
        localMessage = structureMessageData({
          message,
          discussion,
          isUpdate: Boolean(~index),
        });
        if (index !== -1) {
          const currentMessage = meetingMessagesRef.current[index];
          meetingMessagesRef.current[index] = deepMerge(
            currentMessage,
            localMessage
          );
        } else meetingMessagesRef.current.push(localMessage);
      }
      dispatchMessage(localMessage);
    };

    MESSAGE_CHANNEL.addEventListener(name, handleSendMessage);
    socket.on("call-message", handleGetMessage);
    return () => {
      MESSAGE_CHANNEL.removeEventListener(name, handleSendMessage);
      socket.off("call-message", handleGetMessage);
    };
  }, [socket, target, meetingMessagesRef]);
}
