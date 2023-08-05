import { useLayoutEffect, useState } from "react";
import getFullName from "../../../../utils/getFullName";
import compareArray from "../../../../utils/compareArrays";
import store from "../../../../redux/store";

export default function useGetClients (andSelf = false) {
    const [remoteClients, setRemoteClients] = useState(handleGetUserIdentity(andSelf));
    useLayoutEffect(() =>  {
        const unsubscribe = store.subscribe(() => {
            const newRemoteCLients = handleGetUserIdentity(andSelf);
            if(!compareArray(remoteClients, newRemoteCLients))
                setRemoteClients(newRemoteCLients);
        });
        return () => {
            unsubscribe();
        };
    },[remoteClients, andSelf]);
    return remoteClients;
}

const handleGetUserIdentity = (andSelf) =>
store.getState().conference.participants.map(({identity, uid, id, state}) => {
    return {
        id, 
        uid,
        name: getFullName(identity),
        avatarSrc : identity.imageUrl,
        ...identity,
        active: state.inRoom,
    };
}).filter(({id}) => andSelf || (id !== store.getState().meeting.me?.id))