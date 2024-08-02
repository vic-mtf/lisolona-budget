import { createSlice } from "@reduxjs/toolkit";
import deepMerge from "../../utils/mergeDeep";
import { initialState } from "./initialState";
import upArrData from "./updateArraysData";

const data = createSlice({
  name: "data",
  initialState,
  reducers: {
    updateData(state, actions) {
      const { data } = actions.payload;
      const states = deepMerge(state, data);
      Object.keys(states).forEach((key) => {
        state[key] = states[key];
      });
    },
    updateArraysData: upArrData,
  },
});

export const { updateData, updateArraysData } = data.actions;
export default data.reducer;
