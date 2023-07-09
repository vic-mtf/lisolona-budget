import store from '../../../../../../redux/store';
import MessageWorker from '../../../../../../workers/messages/messages.worker';

const messageWorker = MessageWorker();

export default function onDownload ({
    id,
    url,
    downloadsRef,
    type,
    size,
    name,
    setBuffer,
    method,
}) {
    const xhr = new XMLHttpRequest();
    const initData = {
        xhr,
        id,
        loaded: null,
        total: size,
        type: method || 'get',
        name,
        cancel () {
            xhr.abort();
        }
    };
    downloadsRef.current.push(initData)
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.addEventListener('progress', event => {
        initData.loaded = event.loaded;
        initData.total = event.total;
    });
        xhr.addEventListener('load', event => {
    if (xhr.status === 200 && initData.type.toLowerCase() === 'get') {
        const file = xhr.response;
        file.name = name;
        const userId = store.getState().user?.id;
        downloadsRef.current = downloadsRef.current.filter(
            download => download?.id !== id
        );
        setBuffer(file);
        messageWorker?.updateMessages({
            userId,
            updateMessages: [{
                key: id,
                changes: {buffer: file}
            }]
        });
    } else {
        console.error('Erreur lors de la récupération du fichier');
    }
    });
    xhr.addEventListener('error', event => {
    //console.error('Erreur lors de la récupération du fichier :', event);
    });
    xhr.send();
    return initData;
}