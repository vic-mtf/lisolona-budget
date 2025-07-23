import { useContext, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box, Paper } from "@mui/material";
import PropTypes from "prop-types";
import { isNumber } from "lodash";
import WritingArea from "./writing-area/WritingArea";
import { MessagingContext } from "../MessagingBoxProvider";

import store from "../../../../../redux/store";
import { updateArraysData, updateData } from "../../../../../redux/data/data";
import useSocket from "../../../../../hooks/useSocket";
import AudioRecording from "./audio-recording/AudioRecording";
import useSendFiles from "../../../../../hooks/useSendFiles";

export default function MessagingBoxFooter() {
  const socket = useSocket();
  const [{ user, editorRef, placeholder, VListRef, data }] =
    useContext(MessagingContext);
  const replyMessage = useSelector(
    (store) => store.data.app.actions.messaging.reply[user?.id]
  );
  const onSendFiles = useSendFiles();

  const onCancelReplyMessage = useCallback(() => {
    const id = store.getState().data.discussionTarget.id;
    const key = "app.actions.messaging.reply." + id;
    store.dispatch(updateData({ key, data: null }));
  }, []);

  const handleSendMessage = useCallback(
    ({ editorContent: content, data: files }) => {
      const updatedAt = new Date().toJSON();
      const sender = store.getState().user;
      const messages = [];
      const message = {
        content,
        date: updatedAt,
        clientId: Date.now().toString(16) + sender.id,
        type: "text",
        status: "sending",
      };
      if (content) {
        socket?.emit(
          `${user?.type}-message`,
          { to: user?.id, type: user?.type, ...message },
          (response) => {
            console.trace(response); // ok
          }
        );
        messages.push(message);
      }
      if (files?.length) messages.push(...onSendFiles(files));
      const discussions = [{ updatedAt, messages, id: user?.id }];
      const data = { discussions };
      store.dispatch(updateArraysData({ data, user: store.getState().user }));
      if (replyMessage) onCancelReplyMessage();
    },
    [replyMessage, onCancelReplyMessage, user, socket, onSendFiles]
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
