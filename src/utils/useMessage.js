import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChat } from "../redux/data";
import { useSocket } from "./SocketIOProvider";
import timeHumanReadable from "./timeHumanReadable";

export default function useMessage () {
    const socket = useSocket();
    const dispatch = useDispatch();
    const {messages, chatId, conversations, savedMessages} = useSelector(store => {
        const conversations = store?.data?.conversations;
        const chatId = store?.data?.chatId;
        const savedMessages = conversations?.find(item => item?.id === chatId)?.origin?.messages;
        const messages = savedMessages?.map(message => {
            const sender = message?.sender;
            const name = `${sender?.fname} ${sender?.lname} ${sender?.mname}`.trim();
            const time = (new Date(message.createdAt)).toLocaleDateString(
                undefined, 
                {hour: '2-digit', minute: '2-digit'}
            ).slice(11, 20).trim();
            return {
                content: message?.content,
                isYourself: message?.sender?._id === store?.user?.id,
                time,
                userId: message?.sender?._id,
                messageId: message?._id,
                createdAt: message?.createdAt,
                name,
                origin: message,
            }
        });
        return {messages, chatId, savedMessages};
    });

    const groupMss = useMemo(() => groupMessage(messages), [messages]);
    
    useEffect(() => {
        const getDirectMessage = ({messages}) => {
            const newMessages = [];
            [...messages].forEach(message => {
                const isNotFound = !savedMessages.find(({_id}) => message?._id === _id);
                if(isNotFound)
                    newMessages.push(message);
            });
            console.log(newMessages);
            dispatch(updateChat({chatId, messages}))
        }
        socket.on('direct-chat', getDirectMessage);
        return () => {
            socket.off('direct-chat', getDirectMessage);
        }
    })
    return groupMss;
}

const groupMessage =  _messages =>  {
    const groupMss = [];
    const calcDate = (dateA, dateB) => 
    (new Date(dateA)).getTime() - 
    (new Date(dateB)).getTime();
    if(_messages)
        [..._messages].sort((a, b) => calcDate(a?.createdAt, b?.createdAt))
        ?.forEach(message => {
                const date = timeHumanReadable(message.createdAt, true);
                const group = groupMss?.find(({date: _date}) =>  _date === date);
                if(group)
                    group.messages?.push(message);
                else
                    groupMss.push({
                        date,
                        fullTime: (new Date(message.createdAt)).getTime(),
                        messages: [message],
                    });
            });
    return groupMss;
}