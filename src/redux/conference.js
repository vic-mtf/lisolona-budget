import { createSlice } from "@reduxjs/toolkit";
import mergeObjects from "../utils/mergeObject";


const initialState = {
    display: 'auto', //|| 'grid' || 'list',
    nav: null, //|| 'participant' || 'message' || 'option',
    cameraView: 'float', // || 'float' || 'content',
};
// location
const conference = createSlice({
    name: 'conference',
    initialState: {
        ...initialState,
        currentCalls: null,
    },
    reducers: {
        setData(state, actions) {
            const { data } = actions?.payload || {};
            if(data) Object.keys(data)?.forEach(key => {
                if(typeof state[key] === 'object')
                    state[key] = mergeObjects(data[key], state[key])
                else state[key] = data[key];
            });
        }
    }
});

export const { 
    setData
} = conference.actions;
export default conference.reducer;