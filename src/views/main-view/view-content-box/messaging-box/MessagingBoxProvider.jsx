import React, { createContext } from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useRef } from "react";
import getFullName from "../../../../utils/getFullName";
import store from "../../../../redux/store";

export const MessagingContext = createContext(null);

const MessagingProvider = React.memo(({ children }) => {
  const remoteUser = useSelector((store) => store.data.discussionTarget);
  const data = useMemo(() => ({ user: null, messages: [] }), []);
  const editorRef = useRef();
  const VListRef = useRef();
  if (remoteUser && data?.user?.id !== remoteUser?.id) data.user = remoteUser;

  const user = useMemo(() => remoteUser || data.user, [remoteUser, data.user]);
  const contact = useMemo(
    () => store.getState().data.app.contacts.find(({ id }) => id === user?.id),
    [user?.id]
  );
  const placeholder = useMemo(
    () =>
      `Écrire un message ${
        user?.type === "room" ? "dans #" + user.name : "à @" + getFullName(user)
      }`,
    [user]
  );

  return (
    <MessagingContext.Provider
      value={[{ user, editorRef, VListRef, data, placeholder, contact }]}>
      {children}
    </MessagingContext.Provider>
  );
});

MessagingProvider.propTypes = {
  children: PropTypes.node,
};

MessagingProvider.displayName = "MessagingProvider";
export default MessagingProvider;
