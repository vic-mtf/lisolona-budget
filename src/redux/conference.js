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
        setConferenceData(state, actions) {
            const { data } = actions?.payload || {};
            if(data) Object.keys(data)?.forEach(key => {
                if(typeof state[key] === 'object')
                    state[key] = mergeObjects(state[key], data[key])
                else state[key] = data[key];
            });
        }
    }
});

export const { 
    setConferenceData
} = conference.actions;
export default conference.reducer;