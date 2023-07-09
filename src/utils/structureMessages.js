import getServerUri from "./getServerUri";

export default function structureMessages (_message=[], regExp=/video|image/) {
    const messages = [];
    const sortedDate = Array.isArray(_message) ? [..._message] : [];
    sortedDate.sort((a, b) => 
        (new Date(a.createdAt)).getTime() -
        (new Date(b.updatedAt)).getTime()
    );
    sortedDate.forEach((mss, index) => {
        const isCurrentMedia = regExp.test(mss.subType);
        const lastMessage = messages[messages.length - 1];
        const isMediaStacked = Array.isArray(lastMessage?.medias) && 
        lastMessage.isMine === mss.isMine
        const message = {...mss};
        if(isCurrentMedia) {
            message.src =  getServerUri({pathname: mss.content}).toString();
            message.srcSet = message.src;
            if(isMediaStacked) lastMessage.medias.push(message);
            else messages.push({...message, medias: [message]});
        } else messages.push(message);
    });
    return messages.sort((a, b) => 
        (new Date(b.createdAt)).getTime() -
        (new Date(a.updatedAt)).getTime()
    );
}