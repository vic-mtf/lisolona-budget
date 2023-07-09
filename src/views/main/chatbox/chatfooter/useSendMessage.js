import draftToHtml from "draftjs-to-html";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { convertToRaw } from "draft-js";
import { useCallback } from "react";
import { getDraftText } from "./ChatFooter";
import processData from "../../../../utils/processData";
import getServerUri from "../../../../utils/getServerUri";
import { useData } from "../../../../utils/DataProvider";
import store from "../../../../redux/store";
import { initial } from "lodash";
import editorStateEmpty from "./content/editorStateEmpty";
import db from "../../../../database/db";

export default function useSendMessage ({handleChange, editorState, target, files, setFiles}) {
    const socket  = useSocket();
    const [{downloadsRef}] = useData();
    
    const handleSendMessage = useCallback(async() => {
        handleChange(editorStateEmpty(editorState));
        const id = (Date.now() + 1).toString(16) + target.id;
        if(files?.length) {
           const {remonteData, localData} = processData(files, {
                target, 
                date: new Date()
            });
            localData?.forEach((message, index) => {
                db.messages.add(message).then(
                    () => {
                        const data = remonteData[index];
                        sendFile({
                            data,
                            downloadsRef,
                            index
                        });
                    }
                )
            });
           setFiles([]);
        }
        if(getDraftText(editorState)) {
            const createdAt = new Date().toString();
            const rawContentState = convertToRaw(editorState.getCurrentContent());
            const content = draftToHtml(rawContentState);

            const messageType = 'text';
            const message = {
                id,
                type: messageType,
                targetId: target.id,
                content,
                avatarSrc: null,
                createdAt,
                isMine: true,
                sended: false,
                timeout: 5000
            };
            await db.messages.add(message);
            const isExist = Boolean (await db.discussions.get(target.id));
            if(isExist)
                await db.discussions.update(target?.id, {
                    lastNotice: message,
                    updatedAt: new Date(createdAt),
                });
            else {
                await db.discussions.add({
                    id: target.id, 
                    name: target.name, 
                    lastNotice: message,
                    avatarSrc: target.avatarSrc,
                    type: 'direct',
                    updatedAt: new Date(createdAt),
                    createdAt: new Date(createdAt),
                });
            }
            socket?.emit(`${target?.type}-message`, {
                content, 
                to: target?.id,
                date: createdAt,
                type: messageType,
                clientId: id,
            });
        }
    }, [target, editorState, socket, files, downloadsRef, setFiles, handleChange]);
    return handleSendMessage;
}

export function sendFile({data, downloadsRef}) {
    const xhr = new XMLHttpRequest();
    const url = getServerUri({pathname: 'api/chat/file'});
    const token = store.getState()?.user?.token;
    const initData = {
        xhr,
        id: data.clientId,
        total: data?.file?.size,
        loaded: null,
        type: 'post',
        name: data?.file?.name,
        buffer: data.file,
        cancel () {
            xhr.abort();
        },
    };
    downloadsRef.current.push(initData);
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key !== 'file' && data[key] !== undefined) 
            formData.append(key, data[key]);
    });
    if (data.file) formData.append('file', data.file);
    xhr.open('POST', url);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.addEventListener('progress', event => {
        initData.loaded = event.loaded;
        initData.total = event.total;
    });
        xhr.addEventListener('load', event => {
    if (xhr.status >= 200 && xhr.status < 400) {
        downloadsRef.current = downloadsRef?.current?.filter(
            download => download.id !== data.clientId
        );
    } else {
        console.error('Erreur lors de la chargement du fichier: ', data?.name);
    }
    });
    xhr.addEventListener('error', event => {
        console.error('Erreur lors de la récupération du fichier :', data?.name);
    });
    xhr.send(formData);
    return initial;
};
  