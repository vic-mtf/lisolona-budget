import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'none' || 'on' || 'outgoing' || 'incoming',
    mediaType: null,
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
    openMiniChatBox: false,
    screen: 'none',
    currentCalls: null,
};

const teleconference = createSlice({
    name: 'teleconference',
    initialState: {
        ...initialState,
        currentCalls: null,
    },
    reducers: {
        addTeleconference(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(_key => {
                    if(JSON.stringify(state[_key]) !== JSON.stringify(data[_key]))
                        state[_key] = data[_key]
                });
            else if(JSON.stringify(state[key]) !== JSON.stringify(data)) 
                state[key] = data;
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