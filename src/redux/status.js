import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const data = createSlice({
    name: 'status',
    initialState,
    reducers: {
        setStatus(state, actions) {
            const {id, status} = actions.payload;
            if(id) state[id] = status;
            else Object.keys(state).forEach(key => {
                state[key] = status;
            });
        }
    },
});

export const {setStatus} = data.actions;
export default data.reducer;