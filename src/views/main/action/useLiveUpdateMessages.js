import { useLiveQuery } from "dexie-react-hooks"
import { useLayoutEffect } from "react";
import { useData } from "../../../utils/DataProvider";
import db from "../../../database/db";
import structureMessages from "../../../utils/structureMessages";

export default function useLiveUpdateMessages() {
    const data = useLiveQuery(() => db.messages.orderBy('createdAt').toArray());
    const [,{pushMessages}] = useData();
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
            const messages = groupMessage.slice(0, 20);
            const total = groupMessage.length;
            pushMessages({id, messages, total});
        }); 
    },[pushMessages, data]);
}