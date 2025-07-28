import { createSlice } from "@reduxjs/toolkit";
import deepMerge, { setValueByKey } from "../../utils/mergeDeep";
import { initialState } from "./initialState";
import upArrData from "./updateArraysData";
import delInArrayData from "./deleteItemById";
import { isArray } from "lodash";

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateData(state, actions) {
      const { data, key } = actions.payload;
      if (Array.isArray(key) || typeof key === "string") {
        (Array.isArray(key) ? key : [key]).forEach((k, index) => {
          const states = setValueByKey(
            state,
            k,
            isArray(data) ? data[index] : data
          );
          Object.keys(states).forEach((key) => {
            state[key] = states[key];
          });
        });
      } else {
        const states = deepMerge(state, data);
        Object.keys(states).forEach((key) => {
          state[key] = states[key];
        });
      }
    },
    updateMessage(state, actions) {
      const { data, id, targetId } = actions.payload;
      const messages = [...(state.app.messages[targetId] || [])];
      const i = messages?.findIndex((d) => (d?.clientId || d?.id) === id);

      if (i > -1) {
        const oldMessage = messages[i];
        messages[i] = deepMerge(oldMessage, data);
        state.app.messages[targetId] = messages;
      }
    },
    updateArraysData: upArrData,

    deleteInArrayDataItemById: delInArrayData,
  },
});

export const {
  updateData,
  updateArraysData,
  deleteInArrayDataItemById,
  updateMessage,
} = data.actions;
export default data.reducer;
