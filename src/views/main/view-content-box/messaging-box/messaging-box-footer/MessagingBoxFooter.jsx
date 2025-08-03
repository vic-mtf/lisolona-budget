import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { isNumber } from "lodash";
import WritingArea from "./writing-area/WritingArea";
import { updateArraysData, updateData } from "../../../../../redux/data/data";
import useSocket from "../../../../../hooks/useSocket";
import AudioRecording from "./audio-recording/AudioRecording";
import useSendFiles from "../../../../../hooks/useSendFiles";
import getRandomId from "../../../../../utils/getRandomId";
import useMessagingContext from "../../../../../hooks/useMessagingContext";

export default function MessagingBoxFooter() {
  const socket = useSocket();
  const sender = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [{ user, editorRef, placeholder, VListRef, data }] =
    useMessagingContext();

  const replyMessage = useSelector(
    (store) => store.data.app.actions.messaging.reply[user?.id]
  );

  const onSendFiles = useSendFiles();

  const onCancelReplyMessage = useCallback(() => {
    const key = "app.actions.messaging.reply." + user.id;
    dispatch(updateData({ key, data: null }));
  }, [user, dispatch]);

  const handleSendMessage = useCallback(
    ({ editorContent: content, data: files }) => {
      const date = new Date();
      const createdAt = date.toJSON();
      const messages = [];

      const message = {
        content,
        date,
        clientId: getRandomId(sender.id),
        type: "text",
        to: user?.id,
        status: "sending",
      };

      if (content) {
        socket?.emit(`${user?.type}-message`, message);
        const localMessage = {
          sender,
          content,
          createdAt,
          updatedAt: createdAt,
          clientId: message.clientId,
          type: message.type,
        };
        messages.push(localMessage);
      }

      if (files?.length) messages.unshift(...onSendFiles({ files }));
      const [{ updatedAt }] = messages;
      const discussions = [{ updatedAt, messages, id: user?.id }];
      const data = { discussions };
      dispatch(updateArraysData({ data, user: sender }));
      if (replyMessage) onCancelReplyMessage();
    },
    [
      replyMessage,
      onCancelReplyMessage,
      user,
      socket,
      onSendFiles,
      sender,
      dispatch,
    ]
  );

  return (
    <Box
      position='relative'
      component={Paper}
      boxShadow={0}
      elevation={1}
      borderRadius={0}>
      <WritingArea
        onSend={handleSendMessage}
        onCancelReplyMessage={onCancelReplyMessage}
        replyMessage={replyMessage}
        placeholder={placeholder}
        editorRef={editorRef}
        id={user?.id}
        onScrollToMessage={() => {
          const list = VListRef?.current;
          const index = data.messages.findIndex(
            ({ id }) => id === replyMessage?.id
          );
          if (list && isNumber(index))
            list?.scrollToIndex(index, {
              align: "center",
            });
        }}
      />
      <AudioRecording />
    </Box>
  );
}

MessagingBoxFooter.propTypes = {
  user: PropTypes.object,
};
