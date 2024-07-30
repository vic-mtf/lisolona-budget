import { useRef, useState } from "react";

export default function  useScrollEnd (props = {type: 'top', margin: 0}) {
    const [atEnd, setAtEnd] = useState(true);
    const isDispatch = useRef(true);
    const _type = (props?.type || 'top').toLowerCase().trim();
    const type = `scroll${
        _type.charAt(0).toUpperCase() + 
        _type.slice(1, _type.length)
    }`;
    const onScroll = event => {
        const root = event.target;
        if(atEnd && event.target[type] > 0) setAtEnd(false);
        if(!atEnd && event.target[type] === 0) setAtEnd(true);
        const down = root.scrollHeight - (root.scrollTop + root.offsetHeight);
        const up = root.scrollTop;
        const value = Math.round(Math.min(down, up));
        if(_type === 'top' && value <= props.margin && isDispatch.current) {
            if(typeof props?.onScrollEnd === 'function')
                props?.onScrollEnd(
                    event, 
                    value === up ? 'up' : 'down' 
                )
            isDispatch.current = false;
        } 
        if(value > props.margin) 
            isDispatch.current = true;
            
    };
    return [atEnd, { onScroll }];
}