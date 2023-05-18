import { useCallback, useEffect } from "react";
import { useSocket } from "../../../utils/SocketIOProvider"; 
import db from "../../../database/db";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "../../../redux/data";

export default function useGetData () {
    const userId = useSelector(store => store.user.id);
    const socket = useSocket();
    const dispatch = useDispatch();

    const handleMessages = useCallback(async () => {
        const messageGrouping = [];
        const data = await db.messages.toArray();
        data.sort((a, b) => 
            new Date(b?.createdAt) -
           new Date(a?.createdAt) 
        );
        data.forEach(message => {
            const index = messageGrouping.findIndex(({targetId}) => targetId === message.targetId);
            if(index === - 1) 
                messageGrouping.push({
                    targetId: message?.targetId,
                    messages: [message]
                });
            else messageGrouping[index].messages.push(message) 
        });
        if(messageGrouping.length)
            dispatch(addData({
                data: messageGrouping.reverse(),
                key: 'messageGrouping',
            }))
    }, [dispatch]);

    useEffect(() => {
        const onGetData = async ({chats}) => {
            window.socket = socket;
            const discussions = [];
            const messages = [];
            const newDiscussions = [];
            const newMessages = [];
            const updateDiscussions = [];
            const updateMessages = [];
            chats?.forEach((discussion) => {
                const remonteMessages = 
                [...discussion.messages].sort((a, b) =>
                   (new Date (a.createdAt)).getTime() - 
                   (new Date (b.createdAt)).getTime()
                );
                const members = discussion?.members;
                const target = members?.find(({_id: user}) => user._id !== userId)?._id;
                const type = discussion.type;
                const targetId = type === "direct" ? target?._id : discussion?._id;
                const name = type === "direct" ? 
                `${target?.fname || ''} ${target?.lname || ''} ${target?.mname || ''}`.trim() :
                discussion?.name;
                const avatarSrc = type === 'direct' ? target?.imageUrl : discussion.imageUrl;
                const lastNotice = remonteMessages[remonteMessages.length - 1];
                const localDiscussion = {
                    id: targetId, 
                    name, 
                    members,
                    createdBy: discussion.createdBy,
                    desciption: discussion?.desciption,
                    lastNotice,
                    avatarSrc,
                    type,
                    updatedAt: new Date(discussion?.updatedAt),
                    createdAt: new Date(discussion?.createdAt),
                    origin: discussion,
                };
                discussions.push(localDiscussion);
                remonteMessages.forEach((message) =>  {
                    const id = message.clientId || message._id;
                    const sender = message.sender;
                    const name = `${sender?.fname || ''} ${sender?.lname || ''} ${sender?.mname || ''}`.trim();
                    const localMessages = {
                        remonteId: message?._id,
                        id,
                        type: message.type,
                        targetId,
                        content: message?.content,
                        avatarSrc: sender?.imageUrl,
                        createdAt: message?.createdAt,
                        isMine: sender?._id === userId,
                        status: message?.status,
                        origin: message,
                        sended: true,
                        timeout: 5000,
                        updatedAt: message.updatedAt || message?.createdAt,
                        name,
                        subType: message.subtype?.toLowerCase()
                    };
                    messages.push(localMessages);
                });
                
            });
            const discussionsIds = discussions.map(({id}) => id);
            const messagesIds = messages.map(({id}) => id);
            db.discussions.bulkGet(discussionsIds)
            .then(data => {
                data.forEach((discussion, index) => {
                    const remonteDiscussion = discussions[index];
                    if(discussion) {
                        const localTime = (new Date (discussion.updatedAt)).getTime();
                        const remonteTime = (new Date (remonteDiscussion.updatedAt)).getTime();
                        if(localTime !== remonteTime)
                            updateDiscussions.push({
                                key: discussion.id,
                                changes: {
                                    name: remonteDiscussion.name, 
                                    members: remonteDiscussion.members,
                                    lastNotice: remonteDiscussion.lastNotice,
                                    avatarSrc: remonteDiscussion.avatarSrc,
                                    updatedAt: new Date(remonteDiscussion?.updatedAt),
                                    lastNoticeType: remonteDiscussion?.lastNoticeType,
                                    origin: remonteDiscussion.origin,
                                }
                            })
                    }
                    else newDiscussions.push(remonteDiscussion);
                });
                if(newDiscussions.length)
                    db.discussions.bulkAdd(newDiscussions);
                if(updateDiscussions.length)
                    db.discussions.bulkUpdate(updateDiscussions);
            });
            db.messages.bulkGet(messagesIds).then(async data => {
                data.forEach((message, index) => {
                    const remonteMessage = messages[index];
                    if(message) {
                        const localTime = (new Date (message.updatedAt)).getTime();
                        const remonteTime = (new Date (remonteMessage.updatedAt)).getTime();
                        if(localTime !== remonteTime)
                            updateDiscussions.push({
                                key: message.id,
                                changes: {
                                    content: remonteMessage?.content,
                                    avatarSrc: remonteMessage?.imageUrl,
                                    status: remonteMessage?.status,
                                    sended: true,
                                    updatedAt: remonteMessage.updatedAt || remonteMessage?.createdAt,
                                    origin: remonteMessage.origin,
                                }
                            });
                    }
                    else newMessages.push(remonteMessage);
                });
                let loaded = false;
                if(newMessages.length)
                    loaded = Boolean(
                        await db.messages.bulkAdd(newMessages)
                    );
                if(updateMessages.length)
                    loaded = Boolean(
                        await db.messages.bulkUpdate(updateMessages)
                    );
                if(loaded)
                    handleMessages();
            });
        };
        socket?.on('chats', onGetData);
        return () => {
            socket?.off('chats', onGetData);
        };
    }, [socket, userId, handleMessages]);

    useEffect(() => {
        handleMessages();
    },[handleMessages])
}