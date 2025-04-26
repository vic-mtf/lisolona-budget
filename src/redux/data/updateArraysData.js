import formatObjectData, { formatUser } from "../../utils/formatObjectData";
import getFullName from "../../utils/getFullName";
import deepMerge from "../../utils/mergeDeep";

const updateArraysData = (state, actions) => {
  const { data, user } = actions.payload;
  const keys = Object.keys(data);
  const sortByUpdateDate = ({ updatedAt: a }, { updatedAt: b }) =>
    new Date(b) - new Date(a);

  keys.forEach((key) => {
    const values = data[key]?.sort(sortByUpdateDate);
    values.forEach((value) => {
      const formattedValue = formatObjectData(value);

      if (Object.hasOwnProperty.call(formattedValue, "participants")) {
        formattedValue.participants = formattedValue.participants.map(
          (participant) => ({
            ...participant,
            identity: formatUser(participant.identity),
          })
        );
      }
      if (Object.hasOwnProperty.call(formattedValue, "location"))
        formattedValue.location = formatObjectData(formattedValue.location);

      if (Object.hasOwnProperty.call(formattedValue, "grade")) {
        formattedValue.role = formattedValue?.grade?.role;
        formattedValue.grade = formattedValue?.grade?.grade;
      }

      if (Object.hasOwnProperty.call(formattedValue, "members"))
        formattedValue.members = formattedValue.members.map((member) => ({
          ...formatUser(member?._id),
          level: member?.role,
        }));

      if (Object.hasOwnProperty.call(formattedValue, "messages")) {
        formattedValue.messages = formattedValue.messages.map((message) =>
          formatObjectData(
            { ...message, sender: formatUser(message?.sender) },
            { id: "_id", subType: "subtype" }
          )
        );

        if (formattedValue.type === "direct") {
          const remoteUser = formattedValue.members.find(
            ({ id }) => id !== user.id
          );
          formattedValue.id = remoteUser?.id;
        }
      }
      const index = state.app[key].findIndex(
        ({ id }) => id === formattedValue.id
      );

      if (key === "discussions") {
        formattedValue.createdBy = formatObjectData(formattedValue.createdBy);
        const newMessages = formattedValue.messages.map((msg) => ({
          status: msg?.status || "sended",
          ...msg,
        })); //.sort((a, b) => new Date(b.updatedAt).getTime()  - new Date(a.updatedAt).getTime());
        let messages = state.app.messages[formattedValue.id] || [];
        newMessages.forEach((newMessage) => {
          const index = messages.findIndex((msg) =>
            msg.id
              ? msg.id === newMessage.id
              : msg.clientId === newMessage.clientId
          );
          if (index === -1) messages.push(newMessage);
          else messages[index] = deepMerge(messages[index], newMessage);
        });
        messages = messages.sort(sortByUpdateDate);
        state.app.messages[formattedValue.id] = messages;
        delete formattedValue.messages;
        const [message] = messages;
        formattedValue.message = message;

        if (formattedValue.type === "direct") {
          const contactPerson = formattedValue.members.find(
            ({ id }) => id !== user?.id
          );
          formattedValue.name = getFullName(contactPerson);
        }
      }
      if (index > -1) {
        const oldValue = state.app[key][index];
        const updateValue = deepMerge(oldValue, formattedValue);
        state.app[key][index] = updateValue;
      } else state.app[key].push(formattedValue);
    });
  });
};

export default updateArraysData;
