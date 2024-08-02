import { useLiveQuery } from "dexie-react-hooks"
import { useLayoutEffect } from "react";

import structureMessages from "../../../utils/structureMessages";
import db from "../../../database/db";
import { getTime } from "../../../utils/formatTime";

export default function useLiveUpdateMessages() {
    const [,{pushMessages}] useLocalStoreData();
    const data = useLiveQuery(() => db?.messages.orderBy('createdAt').toArray(), [db]);

    useLayoutEffect(() => {
        const group = {};
        data?.forEach(message => {
            const id = message?.targetId;
            if(Array.isArray(group[id])) group[id].push(message);
            else group[id] = [message];
        });
        Object.keys(group).forEach(id => {
            const groupMessage = structureMessages(group[id]);
            const messages = groupMessage.sort((a, b) => getTime(a?.createdAt) - getTime(b?.createdAt));
            const total = groupMessage.length;
            pushMessages({id, messages, total});
        }); 
    },[pushMessages, data]);
}