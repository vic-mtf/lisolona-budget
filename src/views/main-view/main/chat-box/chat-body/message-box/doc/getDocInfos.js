import getServerUri from '../../../../../../utils/getServerUri';

export default async function getDocInfos({typeMIME, content}) {
    const url = getServerUri({pathname: content}).toString();
    let file = null;
    let type = null;
    let size = null;
    try {
        file = await fetch(url, {method: 'HEAD'});
        type = file.headers.get('content-type');
        size = file.headers.get('content-length');
    } catch (error) {}
    return { type, size};
}