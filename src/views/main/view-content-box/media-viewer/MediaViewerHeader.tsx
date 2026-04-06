import React, { useMemo } from "react";
import { ListItem, ListItemAvatar, ListItemText, Toolbar } from "@mui/material";
import ListAvatar from "@/components/ListAvatar";
import useSmallScreen from "@/hooks/useSmallScreen";
import capStr from "@/utils/capStr";
import getFullName from "@/utils/getFullName";
import { formatTime } from "@/utils/formatDate";
import { useSelector } from "react-redux";
import ZoomButton from "./buttons/ZoomButton";
import ScrollToMessageButton from "./buttons/ScrollToMessageButton";
import CloseButton from "./buttons/CloseButton";
import DeleteMediaButton from "./buttons/DeleteMediaButton";
import DownloadMediaButton from "./buttons/DownloadMediaButton";
import useMessagingContext from "@/hooks/useMessagingContext";

const MediaViewerHeader = React.memo(({ onClose, zoom, toggleZoom }) => {
  const matches = useSmallScreen();
  const userId = useSelector((store) => store.user.id);
  const messageId = useSelector(
    (store) => store.data.app.actions.messaging.medias.viewer.id
  );
  const [{ data, user, VListRef }] = useMessagingContext();
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
    <Toolbar
      sx={{
        width: "100%",
        gap: 2,
        flexDirection: { xs: "row-reverse", md: "row" },
        background: (theme) => theme.palette.background.paper,
      }}>
      <ListItem disableGutters disablePadding>
        <ListItemAvatar>
          <ListAvatar id={sender?.id} src={sender?.image} key={sender?.id}>
            {capStr(sender?.firstName?.charAt(0))?.toUpperCase()}
          </ListAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={isYourSelf ? "Vous" : getFullName(sender)}
          secondary={formatTime({
            date: message?.createdAt,
            sameDayOption: "day",
            showTime: true,
          })}
        />
      </ListItem>
      {!matches && (
        <>
          <ScrollToMessageButton
            messages={data?.messages}
            data={message}
            VListRef={VListRef}
            onClose={onClose}
          />
          <DeleteMediaButton />
          <DownloadMediaButton />
          {message?.subType === "IMAGE" && (
            <ZoomButton zoom={zoom} toggleZoom={toggleZoom} />
          )}
        </>
      )}
      <CloseButton onClose={onClose} />
    </Toolbar>
  );
});
MediaViewerHeader.displayName = "MediaViewerHeader";
export default MediaViewerHeader;
