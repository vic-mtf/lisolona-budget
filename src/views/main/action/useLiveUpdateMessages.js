import { useLiveQuery } from "dexie-react-hooks"
import { useLayoutEffect } from "react";
import { useData } from "../../../utils/DataProvider";
import structureMessages from "../../../utils/structureMessages";
import db from "../../../database/db";

export default function useLiveUpdateMessages() {
    const [,{pushMessages}] = useData();
    const data = useLiveQuery(() => db?.messages.orderBy('createdAt').toArray(), [db]);
    useLayoutEffect(() => {
        const messages = data?.sort((a, b) => 
            new Date(b?.createdAt) - new Date(a?.createdAt) 
        );
        const group = {};
        messages?.forEach(message => {
            const id = message?.targetId;
            if(Array.isArray(group[id])) group[id].push(message);
            else group[id] = [message];
        });
        Object.keys(group).forEach(id => {
            const groupMessage = structureMessages(group[id]);
            const messages = groupMessage;
            const total = groupMessage.length;
            pushMessages({id, messages, total});
        }); 
    },[pushMessages, data]);
}