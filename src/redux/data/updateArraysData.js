import formatObjectData, { formatUser } from "../../utils/formatObjectData";
import deepMerge from "../../utils/mergeDeep";

const updateArraysData = (state, actions) => {
  const { payload, store } = actions;
  const keys = Object.keys(payload);

  keys.forEach((key) => {
    const values = payload[key];
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
            { id: "_id" }
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
        state.app.messages[formattedValue.id] = formattedValue.messages.map(
          (msg) => ({ ...msg, status: "send" })
        );
        delete formattedValue.messages;
      }

      if (index > -1) {
        const oldValue = state.app[key][index];
        state.app[key][index] = deepMerge(oldValue, formattedValue);
      } else state.app[key].push(formattedValue);
    });
  });
};

export default updateArraysData;
