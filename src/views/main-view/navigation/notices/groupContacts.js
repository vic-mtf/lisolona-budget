import getFullName from "../../../../utils/getFullName";

export default function groupContact(contacts = []) {
  const sortedContacts = contacts
    ?.map((contact) => ({
      ...contact,
      name: getFullName(contact),
    }))
    ?.sort(({ name: a }, { name: b }) => (a > b ? (1 ? a > b : -1) : 0));
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
}
