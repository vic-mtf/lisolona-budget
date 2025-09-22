import { useLayoutEffect, useState } from "react";

const useVisibleVideoSize = (videoRef) => {
  const [videoMetrics, setVideoMetrics] = useState({
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    offsetX: 0,
    offsetY: 0,
  });

  useLayoutEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const updateSize = () => {
      const { videoWidth, videoHeight, clientWidth, clientHeight } = video;
      if (!videoWidth || !videoHeight) return;

      const videoRatio = videoWidth / videoHeight;
      const elementRatio = clientWidth / clientHeight;

      let visibleWidth, visibleHeight;

      if (elementRatio > videoRatio) {
        // vidéo prend toute la hauteur
        visibleHeight = clientHeight;
        visibleWidth = clientHeight * videoRatio;
      } else {
        // vidéo prend toute la largeur
        visibleWidth = clientWidth;
        visibleHeight = clientWidth / videoRatio;
      }

      const scaleX = visibleWidth / videoWidth;
      const scaleY = visibleHeight / videoHeight;

      const offsetX = (clientWidth - visibleWidth) / 2;
      const offsetY = (clientHeight - visibleHeight) / 2;

      setVideoMetrics({
        width: visibleWidth,
        height: visibleHeight,
        scaleX,
        scaleY,
        offsetX,
        offsetY,
      });
    };

    const handleMetadata = updateSize;

    if (video.readyState >= 1) {
      handleMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleMetadata);
    }

    video.addEventListener("resize", updateSize);

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(video.parentElement ?? video);

    // fallback robuste : polling si pas supporté
    let lastW = video.videoWidth;
    let lastH = video.videoHeight;
    const interval = setInterval(() => {
      if (video.videoWidth !== lastW || video.videoHeight !== lastH) {
        lastW = video.videoWidth;
        lastH = video.videoHeight;
        updateSize();
      }
    }, 500);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadata);
      video.removeEventListener("resize", updateSize);
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, [videoRef]);

  return videoMetrics;
};

export default useVisibleVideoSize;
