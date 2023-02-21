export default function timeHumanReadable (
    _date = new Date(), 
    diabledNum=false, params={ showDetail: false }) {
    const now = new Date();
    const date = new Date(_date);
    const week = 604800000;
    const hours = 86400000;
    const yestarday = 172800000;
    const beforyestarday = 259200000;
    const year = 31104000000;
    const delay = now.getTime() - date.getTime();
    const getHours = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    const getDay = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const showDetail = params?.showDetail || false;
    delete params?.showDetail;
    if(delay <= hours)
        return diabledNum ? `Aujourd'hui ${showDetail ? 'à ' + getHours : ''}`.trim() : getHours;
    if(delay <= yestarday)
        return `Hier ${showDetail ? 'à ' + getHours : ''}`.trim();
    if(delay <= beforyestarday)
        return `Avant hier ${showDetail ? 'à ' + getHours : ''}`.trim();
    if(delay <= week)
        return `${getDay} ${showDetail ? 'à ' + getHours : ''}`.trim();
    return date.toLocaleDateString(
        'fr-FR', 
        showDetail ? {
            weekday: undefined, 
            year: delay > year ? 'numeric' : undefined, 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit',
            minute:'2-digit',
            ...params,
        } : params);
}