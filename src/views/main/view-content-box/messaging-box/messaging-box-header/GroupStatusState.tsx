import { useSelector } from "react-redux";

export default function GroupStatusState({ members }) {
  const contacts = useSelector(
    (store) =>
      store.data.app.contacts?.filter(({ id }) =>
        members?.find((member) => member?.id === id)
      )?.length
  );

  return (
    `${members?.length} members` +
    (contacts > 0 ? `, ${contacts} contact${contacts > 1 ? "s" : ""}` : "")
  );
}
