import { useMemo } from "react";

export default function useGrouped (message, messages) {

    const group = useMemo(() => {

        const index = messages?.findIndex(({id}) => message?.id === id);
        const previousMessage = messages[index - 1];
        const lastMessage = messages[index + 1];

        return {
            isFirst: (previousMessage?.isMine === message?.isMine) && 
            getOriginId(previousMessage) === getOriginId(message),
            direction: getGroupDirection(message),
            isLast: (lastMessage?.isMine === message?.isMine) && 
            getOriginId(lastMessage) === getOriginId(message),
        };

      },[message, messages]);
      return group;
}

const getGroupDirection = message => message?.isMine ? 'right' : 'left';
const getOriginId = message => message?.origin?.sender?._id;