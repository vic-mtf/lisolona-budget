const inputFile = document.createElement('input');
inputFile.webkitdirectory = false;
export default function getFile (props = inputFile) {
    return (
        new Promise ((resolve, reject) => {
            if(typeof props === 'object' && props)
                Object.keys(props).forEach(prop => {
                    inputFile[prop] = props[prop];
                });
            inputFile.type = 'file';
            inputFile.value = '';
            inputFile.onchange = event => {
                const { files } = event.target;
                if(files?.length) resolve([...files].filter(({type}) => type?.trim()));
                else reject(new Error('impossible to get files'));
            }
            inputFile.click();
        })
    )
}