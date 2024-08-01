import { createSlice, isPlainObject } from "@reduxjs/toolkit";
import deepMerge from "../utils/mergeDeep";
import { openerData } from "../components/MeetingProvider";

//mode: 'none' || 'on' || 'outgoing' || 'incoming' || 'join' || 'prepare' , || guest
const options = openerData?.origin?.callDetails || null;

const initialState = {
  mode: openerData?.mode || "none",
  options,
  me: null,
  meetingId: openerData?.origin?._id || null,
  location: openerData?.origin?.location || null,
  createdAt: openerData?.origin?.createdAt || null,
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
    input: {
      deviceId: null,
      label: null,
      width: {
        ideal: window?.opener?.innerWidth,
      },
      height: {
        ideal: window?.opener?.innerHeight,
      },
    },
    output: {
      deviceId: null,
      label: null,
    },
  },
  screen: {
    output: {
      cursor: "always",
      displaySurface: "monitor",
      logicalSurface: true,
      surfaceSwitching: "include",
    },
  },
  audio: {
    input: {
      deviceId: null,
      label: null,
    },
    output: {
      deviceId: null,
      label: null,
    },
  },
  screenSharing: {
    allowed: false,
    active: false,
    published: false,
  },
};
// location
const meeting = createSlice({
  name: "meeting",
  initialState: {
    ...initialState,
    currentCalls: null,
  },
  reducers: {
    setAudioDevice(state, actions) {
      const { data, type } = actions?.payload || {};
      if (data && type)
        state.audio = {
          ...state.audio,
          [type]: {
            ...state.audio[type],
            ...data,
          },
        };
    },
    setVideoDevice(state, actions) {
      const { data, type } = actions?.payload || {};
      if (data && type)
        state.video = {
          ...state.video,
          [type]: {
            ...state.video[type],
            ...data,
          },
        };
    },
    setMicroData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        state.micro = {
          ...state.micro,
          ...data,
        };
    },
    setCameraData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        state.camera = {
          ...state.camera,
          ...data,
        };
    },
    setScreenSharingData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        state.screenSharing = {
          ...state.screenSharing,
          ...data,
        };
    },
    setData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        Object.keys(data)?.forEach((key) => {
          if (isPlainObject(state[key]))
            state[key] = deepMerge(state[key], data[key]);
          else state[key] = data[key];
        });
      if (state.mode === "on") state.startedAt = Date.now();
    },

    updateMeetingData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        Object.keys(data)?.forEach((key) => {
          if (isPlainObject(state[key]))
            state[key] = deepMerge(state[key], data[key]);
          else state[key] = data[key];
        });
      if (state.mode === "on") state.startedAt = Date.now();
    },
  },
});

export const {
  setAudioDevice,
  setVideoDevice,
  setMicroData,
  setCameraData,
  setScreenSharingData,
  setData,
} = meeting.actions;
export default meeting.reducer;
