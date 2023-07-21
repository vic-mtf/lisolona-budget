import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    target: null,
    notifications: null,
    calls: null,
    dialog: null,
};

const data = createSlice({
    name: 'data',
    initialState,
    reducers: {
        addData(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(_key => {
                        state[_key] = data[_key]
                });
            else state[key] = data;
            const target = (key === 'target' && data) || data?.target;
            if(target) {
                state.target = {
                    ...target
                }
                const messages = state.messageGrouping?.find(
                    message => message.targetId === target.id
                )?.messages;
                state.messages = messages || [];
            }
        },
        addNotification(state, actions) {
            const { data } = actions.payload;
            if(state.notifications === null) 
                state.notifications = [data];
            else if (
                JSON.stringify(
                    state.notifications
                    ?.find(({id}) => id === data?.id)
                ) !== JSON.stringify(data)
            ) state.notifications = [
                ...state.notifications, 
                data
            ];
            if(data?.children?.length === 0)
                state.notifications = [...state.notifications]
                .filter(({id}) => id !== data?.id);
        },
    }
});

export const { 
        addData, 
        addNotification, 
     } = data.actions;
export default data.reducer;