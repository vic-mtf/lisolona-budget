import { useMemo } from "react";

export default function useDirection (message, messages) {
    const directions = useMemo(() => {
        const currentIndex = messages?.findIndex(({id}) => message?.id === id);
        const previousIndex = currentIndex - 1;
        const lastIndex = currentIndex + 1;
        const preDir = messages[previousIndex]?.isMine ? 'right' : 'left';
        const lastDir = messages[lastIndex]?.isMine ? 'right' : 'left';
        const direction = message?.isMine ? 'right' : 'left';
        return [preDir, direction, lastDir];
      },[message, messages]);
    return directions; 
}