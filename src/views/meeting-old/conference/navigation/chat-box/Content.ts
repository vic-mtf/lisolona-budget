import ChatArea from "../../../../main/chat-box/chat-area/ChatArea";

export default function Content ({messagesRefs, target}) {
    const  message = messagesRefs?.current;
    return (
        <ChatArea
            target={target} 
            media={false}
            messages={message}
            small
        />
    )
}