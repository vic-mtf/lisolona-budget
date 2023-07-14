import { createSlice } from "@reduxjs/toolkit";
import mergeObjects from "../utils/mergeObject";

const initialState = {
    mode: 'none' || 'on' || 'outgoing' || 'incoming' || 'join' || 'prepare',
    options: null,
    me: null,
    id: null,
    location: null,
    createdAt: null,
    startedAt: null,
    joined: false,
    micro: {
        allowed: false,
        active: false,
        published: false,
    },
    camera: {
        allowed: false,
        active: false,
        published: false,
    },
    video: {
        input : {
            deviceId: null,
            label: null,
            width: {
                ideal: window?.opener?.innerWidth,
            } ,
            height:{
                ideal: window?.opener?.innerHeight,
            },
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
        published: false,
    },
};
// location
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
        },
        setData(state, actions) {
            const { data } = actions?.payload || {};
            if(data) Object.keys(data)?.forEach(key => {
                if(typeof state[key] === 'object')
                    state[key] = mergeObjects(data[key], state[key])
                else state[key] = data[key];
            });
            if(state.mode === 'on')
                state.startedAt = Date.now();
        }
    }
});

export const { 
    setAudioDevice, 
    setVideoDevice,
    setMicroData,
    setCameraData,
    setData
} = meeting.actions;
export default meeting.reducer;