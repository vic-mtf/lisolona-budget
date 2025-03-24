import { createSlice } from "@reduxjs/toolkit";
import deepMerge, { setValueByKey } from "../../utils/mergeDeep";
import { initialState } from "./initialState";
import upArrData from "./updateArraysData";
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
    updateArraysData: upArrData,
  },
});

export const { updateData, updateArraysData } = data.actions;
export default data.reducer;
