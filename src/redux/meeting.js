import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: 'none' || 'on' || 'outgoing' || 'incoming' || 'join',
    micro: {
        allowed: false,
        active: false,
    },
    camera: {
        allowed: false,
        active: false,
    },
    video: {
        input : {
            deviceId: null,
            label: null,
        },
        output: {
            deviceId: null,
            label: null,
        }
    },
    audio: {
        input: {
            deviceId: null,
            label: null,
        },
        output: {
            deviceId: null,
            label: null,
        }
    },
    screenSharing: {
        allowed: false,
        active: false,
    },
};

const meeting = createSlice({
    name: 'meeting',
    initialState: {
        ...initialState,
        currentCalls: null,
    },
    reducers: {
        setAudioDevice(state, actions) {
            const { data, type } = actions?.payload || {};
            if(data && type)
                state.audio = {
                    ...state.audio,
                    [type]: {
                        ...state.audio[type],
                        ...data,
                    }
                };
        },
        setVideoDevice(state, actions) {
            const { data, type } = actions?.payload || {};
            if(data && type)
                state.video = {
                    ...state.video,
                    [type]: {
                        ...state.video[type],
                        ...data,
                    }
                };
        },
        setMicroData(state, actions) {
            const { data } = actions?.payload || {};
            if(data)
                state.micro = {
                    ...state.micro,
                   ...data,
                };
        },
        setCameraData(state, actions) {
            const { data } = actions?.payload || {};
            if(data)
                state.camera = {
                    ...state.camera,
                   ...data,
                };
        }
    }
});

export const { 
    setAudioDevice, 
    setVideoDevice,
    setMicroData,
    setCameraData
} = meeting.actions;
export default meeting.reducer;