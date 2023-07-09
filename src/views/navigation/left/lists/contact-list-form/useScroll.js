import { useCallback } from "react";
import { useState } from "react"

export default function useScroll () {
    const [showShadow, setShowShadow] = useState(false);

    const onScroll = useCallback(event => {
        if(event?.scrollOffset && !showShadow)
            setShowShadow(true);
        if(!event?.scrollOffset && showShadow)
            setShowShadow(false);
    },[showShadow]);
    
    return [showShadow, onScroll];
}