import { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import { updateArraysData, updateData } from "../../redux/data/data";
import { useNotifications } from "@toolpad/core/useNotifications";

const useNewMessage = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handleNewMessage = ({ createdBy, ...data }) => {
      const discussion = { ...data };
      const user = store.getState().user;

      const members = discussion?.members?.map(({ _id, role: level }) => ({
        ..._id,
        level,
      }));
      discussion.createdBy = members.find(({ _id }) => _id === createdBy);
      store.dispatch(
        updateArraysData({ data: { discussions: [discussion] }, user })
      );

      if (discussion?.type === "room" && discussion?.messages?.length === 0) {
        //when local user create new room
        if (user?.id === createdBy) {
          const discussionTarget = store
            .getState()
            .data.app.discussions.find(({ id }) => id === data?._id);
          setTimeout(() => {
            store.dispatch(
              updateData({
                data: { discussionTarget, targetView: "messages" },
              })
            );
          }, 200);
          console.log("nouvelle discussion => ", discussion);
        } else {
          // when remote user create new room
          notifications.show(
            `You have a new message from ${data?.createdBy?.name}`
          );
        }
      }
    };
    socket?.on("direct-chat", handleNewMessage);
    return () => {
      socket?.off("direct-chat", handleNewMessage);
    };
  });
};
export default useNewMessage;
