import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session";

const data = createSlice({
    name: 'data',
    initialState: {
        currentInterlocutor: null,
        conversations: [],
        messages: [],
        notifications: [],
        contacts: [],
        calls: [],
        grousChat: [],
    },
    reducers: {
        addData(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(_key => state[_key] = data[_key]);
            else state[key] = data;
        },
    }
});

export const { addData } = data.actions;
export default persistReducer({
    storage,
    key:'__ROOT_GEID_DATA_LISOLONABUDGET_APP'
}, 
data.reducer
);