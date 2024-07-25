import { createSlice, isPlainObject } from "@reduxjs/toolkit";
import deepMerge from "../utils/mergeDeep";

const initialState = {
  display: "auto", //|| 'grid' || 'list',
  nav: null, //|| 'participant' || 'message' || 'option',
  cameraView: "float", // || 'float' || 'content',
  handRaised: false,
  participants: [], // { identity, state, auth, uid, id }
  moderatorOptions: {
    meetingManagement: false,
    joinBeforeAll: false,
    auth: {
      id: null,
      open: false,
    },
  },
  //participantsState: [],
  pinId: null,
  presenting: false,
};

// location

const conference = createSlice({
  name: "conference",
  initialState: {
    ...initialState,
    currentCalls: null,
  },
  reducers: {
    setConferenceData(state, actions) {
      const { data } = actions?.payload || {};
      if (data)
        Object.keys(data)?.forEach((key) => {
          if (isPlainObject(state[key]))
            state[key] = deepMerge(state[key], data[key]);
          else state[key] = data[key];
        });
    },
    togglePinId(state, actions) {
      const { pinId } = actions?.payload || {};
      if (state.pinId === pinId) state.pinId = null;
      else {
        state.pinId = pinId === undefined ? null : pinId;
        state.presenting = pinId ? true : false;
      }
    },
    updateParticipantState(state, actions) {
      const { data } = actions?.payload || {};
      const key = data.key || "state";

      if (isPlainObject(data) && Array.isArray(data.ids)) {
        data.ids.forEach((id) => {
          const index = state.participants.findIndex(
            (participant) => participant.id === id
          );
          if (~index) {
            const participants = [...state.participants];
            const currentState = participants[index];
            const updateState = {
              ...currentState,
              [key]: {
                ...currentState[key],
                ...data[key],
              },
            };
            participants[index] = updateState;
            state.participants = participants;
          }
        });
      }
    },
    addParticipants(state, actions) {
      const { participants } = actions?.payload || {};
      if (Array.isArray(participants)) {
        const newParticipants = [];
        participants.forEach((participant) => {
          const find = ({ id, uid }) => participant.id === id; // && participant.uid === uid;
          const index = state.participants.findIndex(find);
          const currentParticipant = state.participants.find(find);

          if (index !== -1 && currentParticipant) {
            const currentParticipants = [...state.participants];
            currentParticipants[index] = deepMerge(
              currentParticipant,
              participant
            );
            state.participants = currentParticipants;
          } else newParticipants.push(participant);
        });
        if (newParticipants.length)
          state.participants = state.participants.concat(newParticipants);
      }
    },
  },
});

export const {
  setConferenceData,
  updateParticipantState,
  addParticipants,
  togglePinId,
} = conference.actions;
export default conference.reducer;
