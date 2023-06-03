import draftToHtml from "draftjs-to-html";
import { useSocket } from "../../../../utils/SocketIOProvider";
import { EditorState, convertToRaw } from "draft-js";
import db from "../../../../database/db";
import { useCallback } from "react";
import { getDraftText } from "./ChatFooter";
import decorators from "./content/editor-custom-style/decorators";
import processData from "../../../../utils/processData";
import getServerUri from "../../../../utils/getServerUri";
import { useData } from "../../../../utils/DataProvider";
import structureMessages from "../../../../utils/structureMessages";
import store from "../../../../redux/store";
import { initial } from "lodash";

export default function useSendMessage ({handleChange, editorState, target, files, setFiles}) {
    const socket  = useSocket();
    const [{downloadsRef}] = useData();

     const handleSendMessage = useCallback(async() => {
        const id = (Date.now() + 1).toString(16) + target.id;
        const date = new Date().toString();
        if(files?.length) {
           const {remonteData, localData} = processData(files, {target, date});
           //console.log(localData);
           const messages = structureMessages(localData);
           await db.messages.bulkAdd(localData);
           remonteData?.forEach(data => {
                let groupId;
                if(data.fileType === 'media') {
                   const group = messages?.find(({medias}) => 
                        medias?.find(({id}) => id === data?.clientId)
                    );
                    groupId = group?.id;
                }
                sendFile({
                    data,
                    groupId,
                    downloadsRef,
                });

           });
           messages?.forEach(message => dispatchMessage(message));
           setFiles([]);
        }
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
            dispatchMessage(message);
        }
    }, [target, editorState, handleChange, socket, files, downloadsRef, setFiles]);
    return handleSendMessage;
}

function sendFile({data, downloadsRef, groupId}) {
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
        groupId,
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

function dispatchMessage (message, updated = false) {
    // const name = '_new-message';
    // const root = document.getElementById('root');
    // const customEvent = new CustomEvent(name, {
    //     detail: {name, message, updated}
    // });
    // root.dispatchEvent(customEvent);
}
  