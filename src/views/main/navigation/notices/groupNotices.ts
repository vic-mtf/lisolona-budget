import store from "@/redux/store";
import getFullName from "@/utils/getFullName";

export const groupContact = (contacts = []) => {
  const sortedContacts = contacts
    ?.map((contact) => ({
      ...contact,
      name: getFullName(contact),
    }))
    ?.sort(({ name: a }, { name: b }) => (a === b ? 0 : a > b ? 1 : -1));
  return sortedContacts.reduce((acc, contact) => {
    const accKey = acc?.name?.charAt(0)?.toLowerCase() || null;
    const contacts = Array.isArray(acc)
      ? [...acc]
      : [
          {
            type: "label",
            id: accKey,
            label: accKey.toUpperCase(),
          },
          { ...acc, alpKey: accKey },
        ];
    const alpKey = contact.name.charAt(0).toLowerCase();
    const found = contacts.find(
      ({ type, id }) => id === contacts && type === "label"
    );
    if (found) contacts.push(contact);
    else
      contacts.push(
        {
          type: "label",
          id: alpKey,
          label: alpKey.toUpperCase(),
          alpKey,
        },
        contact
      );
    return contacts;
  });
};

export const groupGuestNotifications = (guests) => {
  const user = store.getState().user;

  return guests?.map((guest) => {
    const isRemote = user?.id !== guest?.from?.id;
    const remoteUser = isRemote ? guest?.from : guest?.to;
    return {
      isRemote: user?.id !== guest?.from?.id,
      name: getFullName(remoteUser),
      user: remoteUser,
      ...guest,
    };
  });
};

const groupNotices = (bulkNotifications) => {
  const notices = [...groupGuestNotifications(bulkNotifications)];
  return notices.sort(
    (a, b) => (a?.createdAt || a?.updatedAt) - (b?.createdAt || b?.updatedAt)
  );
};

export default groupNotices;
