import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import getFullName from "@/utils/getFullName";
import { formatTime } from "@/utils/formatDate";
import useMessagingContext from "@/hooks/useMessagingContext";

const FullScreenHeader = () => {
  const userId = useSelector((store) => store.user.id);
  const messageId = useSelector(
    (store) => store.data.app.actions.messaging.medias.viewer.id
  );
  const [{ user }] = useMessagingContext();
  const bulkMessages = useSelector(
    (store) => store.data.app.messages[user?.id]
  );
  const messages = useMemo(
    () => bulkMessages.filter(({ type }) => type === "media"),
    [bulkMessages]
  );

  const message = useMemo(
    () => messages?.find(({ clientId, id }) => (clientId || id) === messageId),
    [messageId, messages]
  );
  const contact = useSelector((store) =>
    store.data.app.contacts.find(({ id }) => id === message?.sender?.id)
  );
  const sender = useMemo(
    () => contact || message?.sender,
    [message?.sender, contact]
  );
  const isYourSelf = userId === sender?.id;

  return (
    <Typography>
      {isYourSelf ? "Vous" : getFullName(sender)},{" "}
      {formatTime({
        date: message?.createdAt,
        sameDayOption: "day",
        showTime: true,
      })}
    </Typography>
  );
};

export default FullScreenHeader;
