import formatObjectData, { formatUser } from "../../utils/formatObjectData";
import getFullName from "../../utils/getFullName";
import deepMerge from "../../utils/mergeDeep";

const updateArraysData = (state, actions) => {
  const { payload, store } = actions;
  const keys = Object.keys(payload);
  const sortByUpdateDate = ({ updatedAt: a }, { updatedAt: b }) =>
    new Date(b).getTime() - new Date(a).getTime();

  keys.forEach((key) => {
    const values = payload[key]?.sort(sortByUpdateDate);
    values.forEach((value) => {
      const formattedValue = formatObjectData(value);

      if (formattedValue.hasOwnProperty("participants")) {
        formattedValue.participants = formattedValue.participants.map(
          (participant) => ({
            ...participant,
            identity: formatUser(participant.identity),
          })
        );
      }
      if (formattedValue.hasOwnProperty("location"))
        formattedValue.location = formatObjectData(formattedValue.location);

      if (formattedValue.hasOwnProperty("grade")) {
        formattedValue.grade = formattedValue?.grade?.grade;
        formattedValue.role = formattedValue?.grade?.role;
      }

      if (formattedValue.hasOwnProperty("members"))
        formattedValue.members = formattedValue.members.map((member) => ({
          ...formatUser(member?._id),
          level: member?.role,
        }));

      if (formattedValue.hasOwnProperty("messages")) {
        formattedValue.messages = formattedValue.messages.map((message) =>
          formatObjectData(
            { ...message, sender: formatUser(message?.sender) },
            { id: "_id", subType: "subtype" }
          )
        );

        if (formattedValue.type === "direct") {
          const remoteUSer = formattedValue.members.find(
            ({ id }) => id !== store.user.id
          );
          formattedValue.id = remoteUSer?.id;
        }
      }
      const index = state.app[key].findIndex(
        ({ id }) => id === formattedValue.id
      );

      if (key === "discussions") {
        const newMessages = formattedValue.messages.map((msg) => ({
          ...msg,
          status: "send",
        })); //.sort((a, b) => new Date(b.updatedAt).getTime()  - new Date(a.updatedAt).getTime());
        let messages = state.app.messages[formattedValue.id] || [];
        newMessages.forEach((newMessage) => {
          const index = messages.findIndex((msg) => msg.id === newMessage.id);
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
            ({ id }) => id !== store?.user?.id
          );
          formattedValue.name = getFullName(contactPerson);
        }
      }
      if (index > -1) {
        const oldValue = state.app[key][index];
        state.app[key][index] = deepMerge(oldValue, formattedValue);
      } else state.app[key].push(formattedValue);
    });
  });
};

export default updateArraysData;
