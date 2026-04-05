import React from "react";
import MessageContentItem from "./message-content-item/MessageContentItem";
import { useMemo } from "react";
import MessageDateHeader from "./message-date-header/MessageDateHeader";

const MessageItem = React.memo(({ variant = "content", ...otherProps }) => {
  const Item = useMemo(
    () => ({ content: MessageContentItem, date: MessageDateHeader }[variant]),
    [variant]
  );
  return <Item {...otherProps} />;
});

MessageItem.displayName = "MessageItem";

export default MessageItem;
