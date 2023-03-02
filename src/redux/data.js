import { createSlice } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage/session";

const data = createSlice({
    name: 'data',
    initialState: {
        chatId: null,
        conversations: null,
        messages: null,
        notifications: null,
        contacts: null,
        calls: null,
        chatGroups: null,
    },
    reducers: {
        addData(state, actions) {
            const { key, data } = actions.payload;
            if(key === 'data')
                Object.keys(data).forEach(_key => state[_key] = data[_key]);
            else state[key] = data;
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
        updateChat(state, actions) {
            const { chatId, messages } = actions.payload;
            const conversations = [...state.conversations];
            const targetConversation = conversations.find(item => item?.id === chatId);
            const savedMessages = targetConversation?.origin?.messages;
            const newMessages = [];
            [...messages].forEach(message => {
                const isNotFound = !savedMessages.find(({_id}) => message?._id === _id);
                if(isNotFound)
                    newMessages.push(message);
            });
            newMessages.sort((a, b) => 
                (new Date(a?.createdAt)).getTime() - 
                (new Date(b?.createdAt)).getTime()
            );
            const lastMessage = newMessages[newMessages.length - 1];
            savedMessages?.push(...newMessages);
            targetConversation.updatedAt = lastMessage?.createdAt;
            targetConversation.lastNotice = lastMessage?.content;
            state.conversations = [...conversations];
        }
    }
});

export const { addData, addNotification, updateChat } = data.actions;
export default persistReducer({
    storage,
    key:'__ROOT_GEID_DATA_LISOLONABUDGET_APP'
}, 
data.reducer
);