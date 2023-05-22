import draftToHtml from "draftjs-to-html";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { EditorState, convertToRaw } from "draft-js";
import db from "../../../../database/db";
import { useCallback } from "react";
import { getDraftText } from "./ChatFooter";
import decorators from "./content/editor-custom-style/decorators";

export default function useSendMessage ({handleChange, editorState, target, files, setFile}) {
    const socket  = useSocket();
     const handleSendMessage = useCallback(async() => {
        const id = (Date.now() + 1).toString(16) + target.id;
        const date = new Date().toString();

        if(getDraftText(editorState)) {
            const rawContentState = convertToRaw(editorState.getCurrentContent());
            const content = draftToHtml(rawContentState);
            const messageType = 'text';
            const message = {
                id,
                type: messageType,
                targetId: target.id,
                content,
                avatarSrc: null,
                createdAt: date,
                isMine: true,
                sended: false,
                timeout: 5000
            };
            handleChange(
                EditorState.moveFocusToEnd(
                    EditorState.createEmpty(decorators)
                )
            );
            await db.messages.add(message);
            const isExist = Boolean (await db.discussions.get(target.id));
            if(isExist)
                await db.discussions.update(target?.id, {
                    lastNotice: message,
                    updatedAt: new Date(date),
                });
            else {
                await db.discussions.add({
                    id: target.id, 
                    name: target.name, 
                    lastNotice: message,
                    avatarSrc: target.avatarSrc,
                    type: 'direct',
                    updatedAt: new Date(date),
                    createdAt: new Date(date),
                });
            }
            socket?.emit(`${target?.type}-message`, {
                content, 
                to: target?.id,
                date,
                type: messageType,
                clientId: id,
            });
            const name = '_new-message';
            const root = document.getElementById('root');
            const customEvent = new CustomEvent(name, {
                detail: {name, message, updated: false}
            });
            root.dispatchEvent(customEvent);
        }
        if(files?.length) {
            files.forEach(file => {
                const message = {
                    id,
                    type: 'media',
                    targetId: target.id,
                    avatarSrc: null,
                    createdAt: date,
                    isMine: true,
                    sended: false,
                    timeout: 5000
                };
            });
        }
    }, [target, editorState, handleChange, socket, files]);
    return handleSendMessage;
}