import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import app from "./app";
import user from "./user";
import data from "./data/data";
import status from "./status";
import meeting from "./meeting";
import conference from "./conference";

const store = configureStore({
  reducer: { app, user, data, status, meeting, conference },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat((api) => (next) => (action) => {
      action.store = api.getState();
      next(action);
    }),
});

export const persistor = persistStore(store);
export default store;
