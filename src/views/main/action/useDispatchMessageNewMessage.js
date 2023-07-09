import { useCallback, useLayoutEffect } from "react";
import observeLastModification from "../../../utils/observeLastModification";
import { useSelector } from "react-redux";
import structureMessages from "../../../utils/structureMessages";

export default function useDispatchMessageNewMessage () {
    const target = useSelector(store => store?.data.target);
    const dispatchMessage = useCallback((_message, updated = false) => {
        const [mediaMessage] = structureMessages([_message]);
        const message = _message?.type === "media" ? mediaMessage : _message;
        if(target?.id === message?.targetId) {
            const name = '_new-message';
            const root = document.getElementById('root');
            const customEvent = new CustomEvent(name, {
                detail: {name, message, updated}
            });
            root.dispatchEvent(customEvent);
        }
    }, [target]);

    useLayoutEffect(() => {
        const unsubscribe = observeLastModification('messages', dispatchMessage);
        return () => {
            unsubscribe();
        };
    }, [dispatchMessage]);
}