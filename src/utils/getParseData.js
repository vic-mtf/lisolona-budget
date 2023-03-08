export default function getParseData  (_data, user) {
    const data = _data?.map((chat, index, chats) => {
        const interlocutor = chat.members.find(
            ({_id: interlocutor}) => interlocutor._id !== user?.id
        )?._id;
        const {fname, lname, mname} = interlocutor || {};
        const username = interlocutor ? `${fname} ${lname} ${mname}`.trim() : 'Moi';
        const name = chat?.name || username;
        const lastNotice = [
            { content: chat.type === 'room' && `Vous êtes dans un nouveau Lisanga` },
            ...chat?.messages
        ]?.find((message, index, messages) => index === messages.length - 1)?.content;
       
        return  {
            origin: chat,
            id: chat?.type === 'direct' ? interlocutor?._id : chat?._id,
            type: chat?.type,
            lastNotice,
            updatedAt: chat?.updatedAt,
            name,
            avatarSrc: chat?.image,
            online: false,
        }
    });
    return data
}