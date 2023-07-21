export default function combineAudioTracks(...audioTracks) {
    const audioContext = new AudioContext();
    const dest = audioContext.createMediaStreamDestination();
    audioTracks.forEach(track => {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(track);
      const source = audioContext.createMediaStreamSource(mediaStream);
      source.connect(dest);
    });

    return dest.stream.getAudioTracks()[0];
  }
