import { createSlice } from "@reduxjs/toolkit";

const teleconference = createSlice({
    name: 'teleconference',
    initialState: {
        isCalling: false,
        clientId: null,
        type: null,
        variant: null,
    },
    reducers: {
        addTeleconference(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(_key => state[_key] = data[_key]);
            else state[key] = data;
        }
    }
});

export const { addTeleconference } = teleconference.actions;
export default teleconference.reducer;