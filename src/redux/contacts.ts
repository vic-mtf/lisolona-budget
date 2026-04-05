import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session";
import deepMerge from "../utils/mergeDeep";

const user = createSlice({
  name: "user",
  initialState: {
    target: null,
   
  },
  reducers: {},
});

export const { updateUser } = user.actions;
export default persistReducer(
  {
    storage,
    key: "__ROOT_GEID_USER_CONFIG_APP",
  },
  user.reducer
);
