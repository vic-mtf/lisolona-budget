import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import appConfig from "@/configs/app-config.json";
import deepMerge from "@/utils/mergeDeep";
import type { AppSliceState } from "@/types";

const {
  lang,
  colors: {
    primary: { mode },
  },
} = appConfig;

const initialState: AppSliceState = {
  theme: {
    mode: mode as AppSliceState["theme"]["mode"],
    opacity: 0.75,
    blur: 15,
  },
  lang,
  users: [],
  user: {
    stayConnected: false,
    data: null,
  },
  guest: null,
};

const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    updateApp(state, action: PayloadAction<{ data: Partial<AppSliceState> }>) {
      const { data } = action.payload;
      const states = deepMerge(state, data);
      Object.keys(states).forEach((key) => {
        (state as Record<string, unknown>)[key] = states[key];
      });
    },
  },
});

export const { updateApp } = app.actions;

export default persistReducer(
  {
    storage,
    key: "__ROOT_GEID_GLOBAL_CONFIG_APP",
  },
  app.reducer
);
