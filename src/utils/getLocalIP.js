const getLocalIP = async () => {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.createDataChannel('dummy');
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));

    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) return;

      const candidate = event.candidate.candidate;
      const regex = /(?:\d{1,3}\.){3}\d{1,3}/;

      const ip = regex.exec(candidate);
      if (ip) {
        resolve(ip[0]);
        pc.close();
      }
    };
  });
};
export default getLocalIP;
