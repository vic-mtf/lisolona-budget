import React, { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import ringtones, { vibrates } from "../../utils/ringtones";
import { isPlainObject } from "lodash";
import { useNotifications } from "@toolpad/core/useNotifications";
import NoticeSnack from "../../components/NoticeSnack";
import getFullName from "../../utils/getFullName";
import { NAVIGATE_EVENT_NAME } from "../../views/main/navigation/NavTab";

const useNewInvitations = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handelGetChatInvitation = (data) => {
      const notices = getGuests(data);
      const user = store.getState().user;
      const bulkInvitations = store.getState().data.app.notifications;
      store.dispatch({
        type: "data/updateArraysData",
        payload: { data: { notifications: notices }, user },
      });
      const [notice] = notices;
      const recipientId = isPlainObject(notice?.to)
        ? notice?.to?._id
        : notice?.to;

      if (
        hasMissingElements(notices, bulkInvitations) &&
        recipientId === user?.id
      ) {
        ringtones.alert.play();
        vibrates.alert();
        const guest = notice?.from;
        notifications.show(
          React.createElement(NoticeSnack, {
            name: getFullName(guest),
            id: guest?._id,
            inline: true,
            message: `souhaite entrer en contact avec vous`,
          }),
          {
            key: notice?._id,
            actionText: "Voir plus",
            onAction: () => {
              store.dispatch({
                type: "data/updateData",
                payload: {
                  key: `app.actions.notifications.blink.${notice?._id}`,
                  data: true,
                },
              });
              notifications.close(notice?._id);

              const manuelEvent = new CustomEvent(NAVIGATE_EVENT_NAME, {
                detail: { name: NAVIGATE_EVENT_NAME, tab: "notifications" },
              });
              document.getElementById("root").dispatchEvent(manuelEvent);
            },
          }
        );
      }
    };
    socket?.on("invitations", handelGetChatInvitation);
    return () => {
      socket?.off("invitations", handelGetChatInvitation);
    };
  });
};

const getGuests = (data) => {
  let notices = [];
  if (Array.isArray(data)) notices = data;
  else if (
    isPlainObject(data) &&
    Object.hasOwnProperty.call(data, "invitations")
  ) {
    const invitations = data?.invitations;
    notices = Array.isArray(invitations) ? invitations : [invitations];
  } else notices = [data];
  return notices
    ?.map((d) => ({ ...d, variant: "guest" }))
    .sort((a, b) => {
      const dateA = new Date(a?.createdAt || a?.updatedAt);
      const dateB = new Date(b?.createdAt || b?.updatedAt);
      return dateB - dateA;
    });
};

const hasMissingElements = (array1, array2) => {
  const idsInArray2 = new Set(array2.map((el) => el?.id || el?._id));
  return array1.some((el) => !idsInArray2.has(el?.id || el?._id));
};

export default useNewInvitations;

// socket?.on("chats", handelGetChatInvitation);
// socket?.on("invitations", handleSignaling);
// socket?.on("status", toggleStatus);
// socket?.on("contacts", onGetContact);
// socket?.on("call-history", getCallHistory);
// socket?.on("call-status", callStatusChange);
