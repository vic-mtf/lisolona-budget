/**
 * @param {HTMLVideoElement|string|URL}
 * @param {number} [time=0]
 * @returns {Promise<string|URL>}
 */

export default async function createVideoPoster(video, time = 0) {
  return new Promise((resolve, reject) => {
    const videoElement =
      typeof video === "string" ? document.createElement("video") : video;
    if (typeof video === "string") {
      videoElement.src = video;
      videoElement.crossOrigin = "anonymous";
    }
    videoElement.currentTime = time;
    videoElement.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = videoElement.width;
      canvas.height = videoElement.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(
        videoElement,
        0,
        0,
        videoElement.width,
        videoElement.height
      );
      resolve(canvas.toDataURL("image/webp"));
    });

    videoElement.addEventListener("error", (e) => {
      reject(new Error("Impossible to create video poster", e));
    });
    if (videoElement.readyState === 0) {
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement.currentTime = Math.min(time, videoElement.duration);
      });
    }
  });
}
