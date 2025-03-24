
export default function formatTime (props = defaultProps) {
    const { currentTime, padStart } = {...defaultProps, ...props}
    const time = Math.abs(currentTime);
    let days = Math.floor(time / (3600 * 24));
    let hours = Math.floor((time % (3600 * 24)) / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

    days = days ? days + 'j': '';
    hours = hours ? hours + 'h' : '';
    minutes = minutes.toString().padStart(padStart, '0');
    seconds = seconds.toString().padStart(padStart, '0');

    return `${days} ${hours} ${minutes}:${seconds}`.trim();
};
export const getTime =  date => (new Date(date)).getTime();
const defaultProps = {
    currentTime: 0, 
    padStart: 2,
};