export default function getHoursAndMin (_date=new Date()) {
    const date = new Date(_date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}