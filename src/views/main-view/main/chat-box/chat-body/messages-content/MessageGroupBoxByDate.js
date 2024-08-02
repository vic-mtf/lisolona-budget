import React from "react";
import { Divider } from "@mui/material";
import MessageBox from "../message-box/MessageBox";
import Announcement from "../message-box/event/Announcement";
import timeHumanReadable from "../../../../../utils/timeHumanReadable";
import Typography from "../../../../../components/Typography";

const MessageGroupBoxByDate = ({ messages, loadMore }) => {
  const grouping = messageGrouping(messages);
  return grouping
    ?.map(({ messages, date }, index) => (
      <React.Fragment key={date}>
        {messages
          ?.map((message, index, messages) => {
            const data = messageOptions({ message, messages, index });
            return (
              <div key={message?.id}>
                {message?.type === "call" && <Announcement {...data} />}
                {message?.type !== "call" && <MessageBox {...data} />}
              </div>
            );
          })
          .reverse()}
        {!(index === 0 && loadMore) && (
          <div>
            <Divider variant='middle' sx={{ mt: 4 }}>
              <Typography variant='caption' color='text.secondary'>
                {date}
              </Typography>
            </Divider>
          </div>
        )}
      </React.Fragment>
    ))
    .reverse();
};

export const messageGrouping = (_messages) => {
  const groupMss = [];
  const messages = sortMessage(_messages);
  if (messages)
    messages?.forEach((message) => {
      const createdAt =
        message?.createdAt || message?.updatedAt || new Date().toString();
      const date = timeHumanReadable(createdAt, true);
      const group = groupMss?.find(({ date: _date }) => _date === date);
      if (group) group.messages?.push(message);
      else
        groupMss.push({
          date,
          fullTime: new Date(createdAt),
          messages: [message],
        });
    });
  return groupMss;
};

const sortMessage = (_messages) => {
  const messages = [...(_messages || [])];
  messages.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt));
  return messages;
};

const messageOptions = ({ message, messages, index }) => {
  const hideAvatar = messages[index + 1]?.isMine === message?.isMine;
  const joinBox = messages[index - 1]?.isMine === message?.isMine;
  const key = messages.remoteId || (Date.now() + index + 1).toString(16);
  const date = new Date(message?.createdAt);
  const time = `${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
  return { ...message, time, hideAvatar, joinBox, key };
};

export default React.memo(MessageGroupBoxByDate);
