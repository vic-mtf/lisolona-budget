import React, { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import { useNotifications } from "@toolpad/core/useNotifications";
import NoticeSnack from "../../components/NoticeSnack";
import ringtones, { vibrates } from "../../utils/ringtones";

const useNewMessage = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handleNewMessage = ({ createdBy, ...data }) => {
      const discussion = { ...data };
      const user = store.getState().user;
      // console.log("new message => ", discussion);
      const members = discussion?.members?.map(({ _id, role: level }) => ({
        ..._id,
        level,
      }));
      discussion.createdBy = members.find(({ _id }) => _id === createdBy);
      store.dispatch({
        type: "data/updateArraysData",
        payload: { data: { discussions: [discussion] }, user },
      });

      if (discussion?.type === "room" && discussion?.messages?.length === 0) {
        if (user?.id === createdBy) {
          setTimeout(() => {
            const discussionTarget = getDiscussionTarget(data?._id);
            store.dispatch({
              type: "data/updateData",
              payload: {
                data: { discussionTarget, targetView: "messages" },
              },
            });
          }, 200);
        } else {
          ringtones.alert.play();
          vibrates.alert();
          // when remote user create new room
          notifications.show(
            React.createElement(NoticeSnack, {
              name: data?.name,
              id: data?._id,
              message: `vous avez été ajouté par ${discussion?.createdBy?.fname} dans un Lisanga`,
            }),
            {
              autoHideDuration: 7000,
              onAction: () => {
                const discussionTarget = getDiscussionTarget(data?._id);
                store.dispatch({
                  type: "data/updateData",
                  payload: {
                    data: { discussionTarget, targetView: "messages" },
                  },
                });
                notifications.close(data?._id);
              },
              actionText: "Ouvrir",
              key: data?._id,
            }
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

const getDiscussionTarget = (discussionId) => {
  const discussionTarget = store
    .getState()
    .data.app.discussions.find(({ id }) => id === discussionId);
  return discussionTarget;
};

export default useNewMessage;
