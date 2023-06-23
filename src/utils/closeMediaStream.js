export default function closeMediaStream(mediaStream) {
    if (!mediaStream) 
      return ;//Promise.reject(new Error('MediaStream is not defined'));
    const tracks = mediaStream.getTracks();
    const promises = [];
    tracks.forEach(track => {
      promises.push(track.stop());
    });
    return Promise.all(promises)
  }
  