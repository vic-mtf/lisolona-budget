import { configureStore } from "@reduxjs/toolkit";
import {
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist';
import persistStore from "redux-persist/es/persistStore";
import app from "./app";
import user from "./user";
import data from "./data";
import teleconference from "./teleconference";
import status from "./status";
import meeting from "./meeting";
import conference from "./conference";

const store = configureStore({
    reducer: {app, user, data, teleconference, status, meeting, conference},
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
            FLUSH, 
            REHYDRATE, 
            PAUSE, 
            PERSIST, 
            PURGE, 
            REGISTER
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
