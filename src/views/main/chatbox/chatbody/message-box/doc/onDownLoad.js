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
    setBuffer
}) {
    const xhr = new XMLHttpRequest();
    const initData = {
        xhr,
        id,
        loaded: null,
        total: size,
        type: 'get',
        name,
    };
    downloadsRef.current.push(initData)
    xhr.open('GET', url);
    xhr.responseType = 'arraybuffer';
    xhr.addEventListener('progress', event => {
        console.log(`Téléchargé ${event.loaded} octets sur ${event.total}`);
        initData.loaded = event.loaded;
        initData.total = event.total;
    });
        xhr.addEventListener('load', event => {
    if (xhr.status === 200) {
        console.log(`Téléchargement terminé (${xhr.response.byteLength} octets téléchargés)`);
        const file = new File([xhr.response], name, { type });
        const userId = store.getState().user?.id;
        downloadsRef.current = downloadsRef.current.filter(
            download => download?.id !== id
        );
        setBuffer(file);
        messageWorker.updateMessages({
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