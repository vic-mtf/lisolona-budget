import React, { useEffect } from "react";
import useSocket from "../useSocket";
import store from "../../redux/store";
import ringtones, { vibrates } from "../../utils/ringtones";
import { useNotifications } from "@toolpad/core/useNotifications";
import NoticeSnack from "../../components/NoticeSnack";
import { formatUser } from "../../utils/formatObjectData";
import getFullName from "../../utils/getFullName";

const useNewContacts = () => {
  const socket = useSocket();
  const notifications = useNotifications();

  useEffect(() => {
    const handelGetContact = ({ contactOrigin, contacts }) => {
      const newContacts = getMissingElements(
        store.getState().data.app.contacts,
        contacts
      );
      if (newContacts?.length) {
        const invitations = store.getState().data.app.notifications;

        store.dispatch({
          type: "data/updateArraysData",
          payload: {
            data: { contacts: newContacts },
          },
        });
        if (contactOrigin?.to) {
          ringtones.alert.play();
          vibrates.alert();
          const contact = newContacts.find((c) => c._id === contactOrigin.to);

          notifications.show(
            React.createElement(NoticeSnack, {
              name: getFullName(contact),
              id: contact._id,
              src: contact.imageUrl,
              inline: true,
              message: `a accepté votre invitation. Ce contact a été ajouté`,
            }),
            {
              key: contactOrigin.to,
              actionText: "Écrire",
              onAction: () => {
                const data = {
                  discussionTarget: {
                    type: "direct",
                    members: [contact, store.getState().user],
                    ...formatUser(contact),
                  },
                  targetView: "messages",
                };
                store.dispatch({
                  type: "data/updateData",
                  payload: { data },
                });
                notifications.close(contactOrigin.to);
              },
            }
          );

          const isExist = invitations.find((n) => n.to.id === contactOrigin.to);

          if (isExist) {
            store.dispatch({
              type: "data/updateData",
              payload: {
                data: {
                  app: {
                    notifications: invitations.filter(
                      (n) => n.to.id !== contactOrigin.to
                    ),
                  },
                },
              },
            });
          }
        }
      }
    };
    socket?.on("contacts", handelGetContact);
    return () => {
      socket?.off("contacts", handelGetContact);
    };
  });
};

const getMissingElements = (array1, array2) =>
  array2.filter(
    (el) => !new Set(array1.map((el) => el._id || el.id)).has(el._id || el.id)
  );

export default useNewContacts;
