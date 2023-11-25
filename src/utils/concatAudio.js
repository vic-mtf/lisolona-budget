

export default function concatAudio(files, type='audio/webm') {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffers = [];
  
    const readFile = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onload = () => {
          audioContext.decodeAudioData(reader.result, resolve, reject);
        };
  
        reader.onerror = reject;
  
        reader.readAsArrayBuffer(file);
    });
  
    const concatenateBuffers = buffers  => {
      const totalLength = buffers.reduce((length, buffer) => length + buffer.length, 0);
      const concatenatedBuffer = audioContext.createBuffer(1, totalLength, audioContext.sampleRate);
      const channelData = concatenatedBuffer.getChannelData(0);
      let offset = 0;
  
      buffers.forEach(buffer => {
        channelData.set(buffer.getChannelData(0), offset);
        offset += buffer.length;
      });
  
      return concatenatedBuffer;
    }
  
    return Promise.all(files.map(readFile))
      .then(decodedBuffers => {
        return new Blob([concatenateBuffers(decodedBuffers)], {type}) ;
      });
  }
  