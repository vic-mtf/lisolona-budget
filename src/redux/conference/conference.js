import { createSlice } from "@reduxjs/toolkit";
import deepMerge, { setValueByKey } from "../../utils/mergeDeep";
import initialState from "./initialState";
import { isArray } from "lodash";

const conference = createSlice({
  name: "conference",
  initialState,
  reducers: {
    updateConferenceData(state, actions) {
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
  },
});

export const { updateConferenceData } = conference.actions;
export default conference.reducer;
