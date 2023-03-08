import { useSelector } from "react-redux";

export default function useClientId (chatId) {
    const clientId = useSelector(store => {
        const conversations = store.data.conversations;
        const contacts = store.data.contacts;
        const clientIdInConversations = conversations
        ?.find(({id}) => chatId === id)?.interlocutorId;
        const clientIdInContacts = contacts?.find(({id}) => chatId === id)?.id;
        return clientIdInConversations || clientIdInContacts
    });
    return clientId;
}