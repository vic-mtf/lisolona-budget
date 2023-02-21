import { useState } from "react";

export default function  useScrollEnd (props = {type: 'top'}) {
    const [atEnd, setAtEnd] = useState(true);
    const _type = (props?.type || 'type').toLowerCase().trim();
    const type = `scroll${
        _type.charAt(0).toUpperCase() + 
        _type.slice(1, _type.length)
    }`;
    const onScroll = (event) => {
        if(atEnd && event.target[type] > 0) setAtEnd(false);
        if(!atEnd && event.target[type] === 0) setAtEnd(true);
    };
    return [atEnd, { onScroll }];
}