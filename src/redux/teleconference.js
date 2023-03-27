import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    meetingId: null,
    meetingMode: 'none' || 'on' || 'outgoing' || 'incoming',
    members: [],
    mediaType: null,
    type: null,
    screenMode: 'full' || 'medium',
    privileged: false,
    video: true,
    audio: true,
    screenSharing: false,
    from: null,
    videoMirrorMode: 'float' || 'grid' || 'none',
    options: null,
    loading: false,
    response: null,
    error: null,
    joined: false,
    priorityTargetId: null,
};

const teleconference = createSlice({
    name: 'teleconference',
    initialState,
    reducers: {
        addTeleconference(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(
                    _key => state[_key] = data[_key]
                );
            else state[key] = data;
        },
        initializeState(state, actions) {
            const { key, data } = actions?.payload || {};
            Object.keys(initialState).forEach(
                _key => state[_key] = initialState[_key]
            );
            if(key && data) {
                if(key === 'data')
                    Object.keys(data).forEach(
                        _key => state[_key] = data[_key]
                    );
                else state[key] = data;
            }
        }
    }
});

export const { 
    addTeleconference, 
    initializeState 
} = teleconference.actions;
export default teleconference.reducer;