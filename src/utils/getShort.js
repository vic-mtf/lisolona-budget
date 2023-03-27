export default function getShort (name='', len=2) {
    const names = name.split(/\s/);
    const joinChars = names.map(
        (name, index) => index < len ? name.trim().charAt(0) : ''
    ).join('');
    return joinChars.trim();
}