import { isPlainObject } from "lodash";

export default function userGetSender(message, props=null) {
    let data = {};
    const sender = message?.origin?.sender || {};
    if(Array.isArray(props))
        props.forEach(key => data[key] = sender[key]);
    else if(typeof props === 'string')
        data = sender[props];
    else if(props === null)
        data = sender
    return isPlainObject(message) ? data : null;
}