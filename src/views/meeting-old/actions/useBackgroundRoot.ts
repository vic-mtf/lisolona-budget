import { useLayoutEffect } from "react";
import generateBackgroundFromImage from "../../../utils/generateBackgroundFromImage";
import generateBackgroundFromId from "../../../utils/generateBackgroundFromId";

export default function useBackgroundRoot ({target, rootRef}) {
    useLayoutEffect(() => {
        if(target && rootRef?.current) {
            const {id, avatarSrc:as, image} = target;
            const avatarSrc = as || image;
            const getBackground = avatarSrc ? 
            generateBackgroundFromImage : generateBackgroundFromId;
            const key = avatarSrc ? 'url' : 'id';
            const value = avatarSrc || id;
            getBackground({[key]: value}).then(img => {
                rootRef.current.style.background = `url(${img})`;
                rootRef.current.style.backgroundSize = 'cover';
            })
        }
    },[target, rootRef]);
}