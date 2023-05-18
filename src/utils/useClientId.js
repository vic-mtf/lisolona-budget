import { useSelector } from "react-redux";

export default function useClientId (targetId) {
    const clientId = useSelector(store => {
        const conversations = store.data.conversations;
        const contacts = store.data.contacts;
        const clientIdInConversations = conversations
        ?.find(({id}) => targetId === id)?.interlocutorId;
        const clientIdInContacts = contacts?.find(({id}) => targetId === id)?.id;
        return clientIdInConversations || clientIdInContacts
    });
    return clientId;
}