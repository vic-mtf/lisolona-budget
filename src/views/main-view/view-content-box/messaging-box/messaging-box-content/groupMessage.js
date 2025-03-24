import dayjs from "dayjs";

export const sortMessageByDate = (messages = [], reverse) => {
  return [...messages].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return (reverse ? -1 : 1) * (dateA - dateB);
  });
};

export const groupeByDate = (messages = []) => {
  const groupedMessages = {};
  sortMessageByDate(messages, true).forEach((message) => {
    const createdAt = message.createdAt;
    const date = dayjs(createdAt).format("YYYY-MM-DD");
    if (!groupedMessages[date]) groupedMessages[date] = [];
    groupedMessages[date].push(message);
  });
  return groupedMessages;
};

const groupeMessages = (messages = []) => {
  const group = groupeByDate(messages);
  const data = Object.keys(group).map((createdAt) => [
    ...group[createdAt],
    { variant: "date", date: createdAt, messages: group[createdAt], createdAt },
  ]);
  return data.flat().reverse();
};

export default groupeMessages;
