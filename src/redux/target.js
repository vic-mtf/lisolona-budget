import { createSlice } from "@reduxjs/toolkit";
import { isObject } from "lodash";

const initialState = {};

const data = createSlice({
    name: 'target',
    initialState,
    reducers: {
        setTarget(state, actions) {
            const {target} = actions.payload;
            if(target && isObject(target))
                Object.keys(target).forEach(key => state[key] = target[key]);
        },
        clearTarget(state) {
            if(state && isObject(state))
                Object.keys(state).forEach(key => delete state[key]);
        }
    },
});
export const {setStatus} = data.actions;
export default data.reducer;