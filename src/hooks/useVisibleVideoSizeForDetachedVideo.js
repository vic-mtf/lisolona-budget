import { useLayoutEffect, useState } from 'react';

const useVisibleVideoSizeForDetachedVideo = (videoRef, containerRef) => {
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
    const container = containerRef?.current;

    if (!video || !container) return;

    const updateSize = () => {
      const { videoWidth, videoHeight } = video;
      const { clientWidth: containerWidth, clientHeight: containerHeight } =
        container;

      if (!videoWidth || !videoHeight || !containerWidth || !containerHeight)
        return;

      const videoRatio = videoWidth / videoHeight;
      const containerRatio = containerWidth / containerHeight;

      let visibleWidth, visibleHeight;

      if (containerRatio > videoRatio) {
        // vidéo prend toute la hauteur
        visibleHeight = containerHeight;
        visibleWidth = containerHeight * videoRatio;
      } else {
        // vidéo prend toute la largeur
        visibleWidth = containerWidth;
        visibleHeight = containerWidth / videoRatio;
      }

      const scaleX = visibleWidth / videoWidth;
      const scaleY = visibleHeight / videoHeight;

      const offsetX = (containerWidth - visibleWidth) / 2;
      const offsetY = (containerHeight - visibleHeight) / 2;

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
      video.addEventListener('loadedmetadata', handleMetadata);
    }

    // Observe les changements du conteneur
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    // Fallback : surveille les changements du videoWidth/videoHeight
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
      video.removeEventListener('loadedmetadata', handleMetadata);
      resizeObserver.disconnect();
      clearInterval(interval);
    };
  }, [videoRef, containerRef]);

  return videoMetrics;
};

export default useVisibleVideoSizeForDetachedVideo;
