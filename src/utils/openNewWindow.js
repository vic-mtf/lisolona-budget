const width = window.innerWidth * .65;
const height = window.innerHeight * .85;
const left = (window.innerWidth - width) / 2;
const top = (window.innerHeight - height) / 2;

const _args = {
    url: '',
    // width,
    // height,
    // top,
    // left,
    // target: '_blank',
    popup: 'yes',
    location: 'no',
    menubar: 'no',
    status: 'no'
};

export default function openNewWindow (args = _args) {
    const {url, target, ...otherProps} = {..._args, ...args};
    const options = Object.keys(otherProps).map(key => `${key}=${otherProps[key]}`).join(', ');
    const wd = window.open(url,
        target,
        options,
    );
    window.addEventListener('beforeunload', () => {
        if(!wd.closed) wd.close();
    });
    return wd;
}