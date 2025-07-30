import React, { useEffect, useMemo, useLayoutEffect } from "react";
import { List } from "@mui/material";
import { useSelector } from "react-redux";
import { VList } from "virtua";
import PropTypes from "prop-types";
import MessageItem from "./MessageItem";
import groupeMessages from "./groupMessage";
// import useSmallScreen from "../../../../../hooks/useSmallScreen";
import StickToBottomButton from "./StickToBottomButton";
import { useCallback } from "react";
import { useState } from "react";

const MessageList = ({ user, VListRef, data }) => {
  const [shouldStickToBottom, setShouldStickToBottom] = useState(false);
  const VListStateMemo = useMemo(
    () => ({
      isPrepend: false,
      autoScrollToBottom: true,
      isFirstRender: true,
      lastMessageId: null,
    }),
    []
  );
  const bulkMessages = useSelector(
    (store) => store.data.app.messages[user?.id]
  );
  // const matches = useSmallScreen();
  const messages = useMemo(() => groupeMessages(bulkMessages), [bulkMessages]);
  //console.log(messages);

  const onScrollToBottom = useCallback(() => {
    VListRef.current.scrollToIndex(messages.length - 1, {
      align: "end",
    });
  }, [messages.length, VListRef]);

  useLayoutEffect(() => {
    // if (data.messages?.length === messages.length)
    //   VListStateMemo.autoScrollToBottom = false;
    data.messages = messages;
  }, [messages, data, VListStateMemo]);

  useEffect(() => {
    if (!VListRef.current) return;
    const { clientId } = messages[messages.length - 1] || {};
    const { lastMessageId } = VListStateMemo || {};
    VListStateMemo.autoScrollToBottom = clientId !== lastMessageId;
    VListStateMemo.lastMessageId = clientId;

    if (VListStateMemo.autoScrollToBottom) onScrollToBottom();
  }, [VListStateMemo, VListRef, onScrollToBottom, messages]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        contain: "strict",
        position: "relative",
      }}>
      <StickToBottomButton
        VListRef={VListRef}
        onScrollToBottom={onScrollToBottom}
        shouldStickToBottom={shouldStickToBottom}
      />
      <List
        component={VList}
        ref={VListRef}
        style={{ flex: 1, paddingTop: 100 }}
        reverse
        shift={VListStateMemo.isPrepend}
        overscan={10}
        onScroll={(offset) => {
          const { scrollSize, viewportSize } = VListRef.current;
          const size = Math.abs(offset - scrollSize + viewportSize);
          const MAX_SIZE = 650;
          if (size >= MAX_SIZE && !shouldStickToBottom) {
            setShouldStickToBottom(true);
            VListStateMemo.autoScrollToBottom = false;
          }
          if (size < MAX_SIZE && shouldStickToBottom) {
            setShouldStickToBottom(false);
            VListStateMemo.autoScrollToBottom = true;
          }
        }}>
        {messages.map((message, index, messages) => {
          const previousMessage = messages[index - 1];
          const nextMessage = messages[index + 1];
          const hide = message?.sender?.id === previousMessage?.sender?.id;
          const variant = message?.variant;
          const date = message?.date;
          const grouped = message?.sender?.id === nextMessage?.sender?.id;
          const id = message?.clientId || message?.id || message?.date;

          return (
            <MessageItem
              key={id}
              message={message}
              hideAvatar={hide}
              hideName={hide}
              grouped={grouped}
              user={user}
              variant={variant}
              date={date}
            />
          );
        })}
      </List>
    </div>
  );
};

MessageList.propTypes = {
  user: PropTypes.object,
  data: PropTypes.object,
  VListRef: PropTypes.object,
};

export default React.memo(MessageList);
