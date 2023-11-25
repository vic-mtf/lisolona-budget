function readFileAsync(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

export default async function mergeAudioBlobs(blobs, type='audio/webm') {
    const buffers = [];
    for(let blob of blobs) 
        buffers.push(await readFileAsync(blob));
    const totalLength = buffers.reduce((total, arr) => total + arr.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for(let buffer of buffers) {
        result.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    }
    return new Blob([result], {type});
}
