import React from "react";
import PropTypes from "prop-types";
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

MessageItem.propTypes = {
  variant: PropTypes.oneOf(["date", "content", "system"]),
};

export default MessageItem;
