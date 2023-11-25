import getFullName from '../utils/getFullName';
import store from '../redux/store';
import db from './db';
import { getTime } from '../utils/formatTime';
import filterByKey from '../utils/filterByKey';

export default function structureMessageData ({
    message, 
    discussion, 
    userId = store.getState().user.id,
    isUpdate = false
}) {
    const members = discussion?.members;
    const target = members?.find(({_id: user}) => user._id !== userId)?._id;
    const id = message?.clientId || message?._id;
    const targetId = discussion?.type === 'direct' ? target?._id : discussion?._id;
    const sender = message?.sender;
    const name = getFullName(sender);
    const data = {
        ...isUpdate ? {sended: true} : {
            avatarSrc: message?.imageUrl,
            timeout: 10000,
            createdAt: message?.createdAt,
            remoteId: message?._id,
            type: message?.type,
            subType: message.subtype?.toLowerCase(),
            targetId,
            isMine: sender?._id === userId,
            name,
            id,
        },
        content: message?.content,
        status: message?.status,
        origin: message,
        sended: false,
        updatedAt: message?.updatedAt || message?.createdAt,
    };
    Object.keys(data).forEach(key => {
        if(data[key] === undefined) delete data[key];
    });
    return data;
};

export async function getMessages (messages=[], discussion) {

    const newMessages = [];
    const updateMessages = []
    const messagesIds = messages.map(message => structureMessageData({message, discussion})?.id); 
    const data = await db?.messages?.bulkGet(messagesIds);
    data.forEach((message, index) => {
        const remoteMessage = messages[index];
        if(message) {
            const localTime = getTime(message?.updatedAt);
            const remoteTime = getTime(remoteMessage.updatedAt);
            if(localTime !== remoteTime)
                updateMessages.push({
                    key: message.id,
                    changes: structureMessageData({
                        message: remoteMessage,
                        discussion,
                        isUpdate: true,
                    })
                });
        }
        else newMessages.push(structureMessageData({
            message: remoteMessage,
            discussion,
        }));
    });
    return {
        newMessages,
        updateMessages
    }
}