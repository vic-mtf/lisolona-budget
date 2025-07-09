import { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import { updateArraysData } from "../../redux/data/data";

const useNewChat = () => {
  const socket = useSocket();

  useEffect(() => {
    const handelGetChat = (data) => {
      console.log(data);
      //   const [{ createdAt: updatedAt }] = messages;
      //   const localUser = store.getState().user;

      //   // _id is member object and not a string
      //   const remoteUser = members?.find(
      //     ({ _id: user }) => user?._id !== localUser?.id
      //   )?._id;
      //   const id = type === "room" ? _id : remoteUser?._id;
      //   const discussions = [{ updatedAt, messages, id }];
      //   //console.log("remote discussion => ", id);
      //   const user = store.getState().user;
      //   const data = { discussions };
      //   store.dispatch(updateArraysData({ data, user }));
      console.log(data);
    };
    socket?.on("chats", handelGetChat);
    return () => {
      socket?.off("direct-chat", handelGetChat);
    };
  });
};

export default useNewChat;
