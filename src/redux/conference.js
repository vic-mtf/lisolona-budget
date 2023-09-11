import { createSlice } from "@reduxjs/toolkit";
import mergeObjects from "../utils/mergeObject";


const initialState = {
    display: 'auto', //|| 'grid' || 'list',
    nav: null, //|| 'participant' || 'message' || 'option',
    cameraView: 'float', // || 'float' || 'content',
    handRaised: false,
    participants: [], // {identity, state, auth, uid, id}
    //participantsState: [],
    pinId: null,
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
        },
        togglePinId(state, actions) {
            const { pinId } = actions?.payload || {};
            if(state.pinId === pinId) 
                state.pinId = null;
            else state.pinId = pinId === undefined ? null : pinId;
        },
        updateParticipantState(state, actions) {
            const { data } = actions?.payload || {};
            const key = data.key || 'state';

            if(typeof data === 'object' && Array.isArray(data.ids)) {
                data.ids.forEach(id => {
                    const index = state.participants.findIndex(participant => participant.id === id);
                    if(~index) {
                        const participants = [...state.participants];
                        const currentState = participants[index];
                        const updateState = {
                            ...currentState,
                            [key]: {
                                ...currentState[key],
                                ...data[key],
                            }
                        };
                        participants[index] = updateState;
                        state.participants = participants;
                    }
                })
            }
        },
        addParticipants(state, actions) {
            const { participants } = actions?.payload || {};
            if(Array.isArray(participants)) {
                const newParticipants = [];
                participants.forEach(participant => {
                    const index = state.participants
                    .findIndex(({id, uid}) => participant.id === id || participant.uid === uid);
                    if(index !== -1) {
                        const participants = state.participants.concat([]);
                        const currentState = participants[index];
                        participants[index] = mergeObjects(currentState, participants);
                        state.participants = participants;
                    } else newParticipants.push(participant);
                });
                if(newParticipants.length) 
                    state.participants = state.participants.concat(newParticipants);
            }
        }
    }
});

export const { 
    setConferenceData,
    updateParticipantState,
    addParticipants,
    togglePinId,
} = conference.actions;
export default conference.reducer;