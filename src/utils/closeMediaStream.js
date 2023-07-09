export default async function closeMediaStream(stream) {
  if (!stream) {
    return;
  }
  const tracks = stream.getTracks();
  const promises = [];

  tracks.forEach(track => {
    const promise = track.stop();
    promises.push(promise);
  });

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error closing MediaStream:', error);
  }
}
