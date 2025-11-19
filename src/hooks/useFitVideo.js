import { useEffect, useMemo, useState } from 'react';

const useFitVideo = (videoRef) => {
  const [videoRatio, setVideoRatio] = useState(null);
  const [parentRatio, setParentRatio] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateRatioFromVideo = () => {
      const w = video.videoWidth || video.naturalWidth || 0;
      const h = video.videoHeight || video.naturalHeight || 0;
      if (w > 0 && h > 0) setVideoRatio(w / h);
    };

    updateRatioFromVideo();
    video.addEventListener('loadedmetadata', updateRatioFromVideo);

    return () => {
      video.removeEventListener('loadedmetadata', updateRatioFromVideo);
    };
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const parent = video.parentElement;
    if (!parent) return;

    const computeParentRatio = () => {
      const rect = parent.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setParentRatio(rect.width / rect.height);
      }
    };

    computeParentRatio();

    const ro = new ResizeObserver(() => computeParentRatio());
    ro.observe(parent);

    window.addEventListener('resize', computeParentRatio);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeParentRatio);
    };
  }, [videoRef]);

  const style = useMemo(() => {
    const base = {
      display: 'block',
      maxWidth: '100%',
      maxHeight: '100%',
      background: 'transparent',
      objectFit: 'contain',
      width: 'auto',
      height: 'auto',
    };

    if (videoRatio == null || parentRatio == null) return base;

    if (parentRatio > videoRatio) {
      return { ...base, height: '100%', width: 'auto' };
    } else {
      return { ...base, width: '100%', height: 'auto' };
    }
  }, [videoRatio, parentRatio]);
  return style;
};

export default useFitVideo;
