import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../utils/SocketIOProvider";
import answerRingtone from "../../../utils/answerRingtone";
import db from "../../../database/db";
import getFullName from "../../../utils/getFullName";

export default function useGetNewMessage () {
    const userId = useSelector(store => store.user.id);
    const target = useSelector(store => store.data.target);
    const socket = useSocket();

    useEffect(() => {
        const getNewMessage = ({messages, _id, type, members, ...otherPros}) => {
            const contact = members?.find(({_id: user}) => user?._id !== userId)?._id;
            const targetId = type === 'room' ? _id : contact?._id;
            const message = messages[messages.length - 1];
            const id = message?.clientId || message?._id;
            const sender = message?.sender;
            const name = getFullName(sender)
            const isMine = sender?._id === userId;
            const localMessage = {
                remoteId: message?._id,
                id,
                type: message?.type,
                subType: message?.subtype?.toLowerCase(),
                targetId,
                content: message?.content,
                avatarSrc: sender?.imageUrl,
                createdAt: message?.createdAt,
                isMine,
                status: message?.status,
                origin: message,
                sended: true,
                timeout: 5000,
                updatedAt: message?.updatedAt || message?.createdAt,
                name,
            };
            if(message)
                db?.messages.get(id).then(async data => {
                    if(data) {
                        const localTime = (new Date (data.updatedAt)).getTime();
                        const remoteTime = (new Date (message.updatedAt)).getTime();
                        if(localTime !== remoteTime || data.sended !== message.sended) {
                            db?.messages.update(id, {
                                origin: message,
                                updatedAt: message?.updatedAt,
                                name,
                                avatarSrc: sender?.imageUrl,
                                remoteId: message?._id,
                                sended: true,
                            });
                        }
                    } else {
                        db?.messages.add(localMessage).then(() => {
                            if(!isMine && document.visibilityState === 'hidden') {
                                answerRingtone('receive');
                            }
                        });
                    };
                });
            if(targetId)
            db?.discussions.get(targetId).then(data => {
                if(data) {
                    const localTime = (new Date (data.lastNotice.updatedAt)).getTime();
                    const remoteTime = (new Date (message.updatedAt)).getTime();
                    if(isNaN(localTime) ||  localTime < remoteTime) {
                        db?.discussions.update(targetId, {
                            updatedAt: new Date (message.updatedAt),
                            lastNotice: message,
                            origin: {messages, _id, type, members, ...otherPros},
                            members,
                        })
                    }
                } else db?.discussions.add({
                        id: targetId, 
                        members,
                        type,
                        origin: {messages, _id, type, members, ...otherPros},
                        ...type === 'direct' ? {
                            lastNotice: message,
                            updatedAt: new Date(otherPros?.updatedAt),
                            createdAt: new Date(otherPros?.createdAt),
                            avatarSrc: sender?.imageUrl,
                            name,
                        } : {
                            description: otherPros.description,
                            updatedAt: new Date (otherPros?.updatedAt),
                            createdAt: new Date(otherPros?.createdAt),
                            createdBy: otherPros?.createdBy,
                            avatarSrc: otherPros?.imageUrl,
                            name: otherPros?.name,
                        }, 
                    });
            }); 
        }
        socket?.on('direct-chat', getNewMessage);
        return () => {
            socket?.off('direct-chat', getNewMessage);
        }
    }, [socket, userId, target]);
}