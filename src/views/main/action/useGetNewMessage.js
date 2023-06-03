import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "../../../utils/SocketIOProvider";
import db from "../../../database/db";
import answerRingtone from "../../../utils/answerRingtone";

export default function useGetNewMessage () {
    const userId = useSelector(store => store.user.id);
    const target = useSelector(store => store.data.target);
    const socket = useSocket();

    useEffect(() => {
        const getNewMessage = ({messages, _id, type, members, ...otherPros}) => {
            //console.log({messages, _id, type, members, ...otherPros});
            const contact = members?.find(({_id: user}) => user?._id !== userId)?._id;
            const targetId = type === 'room' ? _id : contact?._id;
            const message = messages[messages.length - 1];
            const id = message.clientId || message._id;
            const sender = message.sender;
            const name = `${sender?.fname || ''} ${sender?.lname || ''} ${sender?.mname || ''}`.trim();
            const isMine = sender?._id === userId;

            const localMessage = {
                remonteId: message?._id,
                id,
                type: message.type,
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
                updatedAt: message.updatedAt || message?.createdAt,
                name,
            };
            console.log('update', message, localMessage);
            db.messages.get(id).then(async data => {
                if(data) {
                    const localTime = (new Date (data.updatedAt)).getTime();
                    const remonteTime = (new Date (message.updatedAt)).getTime();
                    if(localTime !== remonteTime || data.sended !== message.sended) {
                      await  db.messages.update(id, {
                            origin: message,
                            updatedAt: message.updatedAt,
                            name,
                            avatarSrc: sender?.imageUrl,
                            remonteId: message?._id,
                            sended: true,
                        })
                    }
                } else {
                    await db.messages.add(localMessage);
                    if(!isMine && document.visibilityState === 'hidden') {
                        answerRingtone('receive');
                    }

                };
                // if(targetId === target?.id) {
                //     const _name = '_new-message';
                //     const root = document.getElementById('root');
                //     const customEvent = new CustomEvent(_name, {
                //         detail: {name: _name, message: localMessage, updated: true}
                //     });
                //     root.dispatchEvent(customEvent);
                // }
            });
            db.discussions.get(localMessage.targetId).then(data => {
                if(data) {
                    const localTime = (new Date (data.lastNotice.updatedAt)).getTime();
                    const remonteTime = (new Date (message.updatedAt)).getTime();
                    if(isNaN(localTime) ||  localTime < remonteTime) {
                        db.discussions.update(localMessage.targetId, {
                            updatedAt: new Date (message.updatedAt),
                            lastNotice: message,
                            origin: {messages, _id, type, members, ...otherPros},
                            members,
                        })
                    }
                } else db.discussions.add({
                    updatedAt: new Date (message.updatedAt),
                    createdAt: new Date(message?.createdAt),
                    lastNotice: message,
                    id: message.targetId, 
                    name, 
                    members,
                    avatarSrc: sender.imageUrl,
                    type: 'direct',
                    origin: {messages, _id, type, members, ...otherPros},
                });
            }); 
            //console.log('vu');
        }
        socket?.on('direct-chat', getNewMessage);
        return () => {
            socket?.off('direct-chat', getNewMessage);
        }
    }, [socket, userId, target]);
}