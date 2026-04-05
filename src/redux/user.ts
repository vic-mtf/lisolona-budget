import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session";
import deepMerge from "@/utils/mergeDeep";
import type { UserSliceState } from "@/types";

const initialState: UserSliceState = {
  id: null,
  token: null,
  email: null,
  firstName: null,
  lastName: null,
  middleName: null,
  name: null,
  docTypes: null,
  number: null,
  image: null,
  grade: null,
  role: null,
  auth: null,
  connected: false,
  isGuest: false,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(
      state,
      action: PayloadAction<{ data: Partial<UserSliceState> }>
    ) {
      const { data } = action.payload;
      const states = deepMerge(state, data);
      Object.keys(states).forEach((key) => {
        (state as Record<string, unknown>)[key] = states[key];
      });
    },
  },
});

export const { updateUser } = user.actions;

export default persistReducer(
  {
    storage,
    key: "__ROOT_GEID_USER_CONFIG_APP",
  },
  user.reducer
);
