import { createSlice } from "@reduxjs/toolkit";
import deepMerge from "../utils/mergeDeep";
import modifyObject from "../utils/modifyObject";
import { isPlainObject } from "lodash";

const initialState = {
  target: null,
  notifications: null,
  calls: null,
  dialog: null,
  activeCall: false,
  chatBox: {
    footer: {
      toolbar: true,
      emojiBar: false,
      recording: false,
      files: [],
    },
  },
};

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    addData(state, actions) {
      const { key, data } = actions.payload;
      if (key === "data")
        Object.keys(data).forEach((_key) => {
          state[_key] = data[_key];
        });
      else state[key] = data;
      const target = (key === "target" && data) || data?.target;
      if (target) {
        state.target = {
          ...target,
          showDetail: false,
        };
        // const messages = state.messageGrouping?.find(
        //     message => message.targetId === target.id
        // )?.messages;
        // state.messages = messages || [];
      }
    },
    setData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        Object.keys(data)?.forEach((key) => {
          if (isPlainObject(state[key]))
            state[key] = deepMerge(state[key], data[key]);
          else state[key] = data[key];
        });
      if (state.mode === "on") state.startedAt = Date.now();
    },
    modifyData(state, actions) {
      const cloneState = { ...state };
      modifyObject(cloneState, actions.payload);
      Object.keys(state).forEach((key) => {
        state[key] = cloneState[key];
      });
    },
    addNotification(state, actions) {
      const { data } = actions.payload;
      if (state.notifications === null) state.notifications = [data];
      else if (
        JSON.stringify(
          state.notifications?.find(({ id }) => id === data?.id)
        ) !== JSON.stringify(data)
      )
        state.notifications = [...state.notifications, data];
      if (data?.children?.length === 0)
        state.notifications = [...state.notifications].filter(
          ({ id }) => id !== data?.id
        );
    },
  },
});

export const { addData, addNotification, setData, modifyData } = data.actions;
export default data.reducer;
