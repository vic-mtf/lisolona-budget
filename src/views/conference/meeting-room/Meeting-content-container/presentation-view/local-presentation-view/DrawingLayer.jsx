import React, { useMemo, useRef, useEffect } from 'react';
import useVisibleVideoSizeForDetachedVideo from '../../../../../../hooks/useVisibleVideoSizeForDetachedVideo';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import annotationStyles, {
  findById,
} from './local-presentation-view-header/annotationStyles';
import { Layer, Image } from 'react-konva';
import DrawingStageProvider from '../../../../../../components/DrawingStageProvider';
import DrawingArea from './DrawingArea';
import EphemeralPencil from './pencils/EphemeralPencil';
import useLocalStoreData from '../../../../../../hooks/useLocalStoreData';

const DrawingLayer = ({ stageRef }) => {
  const containerRef = useRef(null);
  const videoElRef = useRef(
    (() => {
      const video = document.createElement('video');
      video.playsInline = true;
      video.muted = true;
      video.autoplay = true;
      return video;
    })()
  );
  const [getData] = useLocalStoreData('conference.setup.devices.screen');
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );
  const { height, width, scaleX, scaleY, offsetX, offsetY } =
    useVisibleVideoSizeForDetachedVideo(videoElRef, containerRef);
  const animationRef = useRef(null);
  const videoLayerRef = useRef(null);

  const mode = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.mode
  );
  const color = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.color
  );
  const active = useSelector(
    (store) =>
      store.conference.meeting.actions.localPresentation.annotation.active
  );

  const modeSelected = useMemo(
    () => findById({ kinds: annotationStyles }, mode),
    [mode]
  );

  const cursor = useMemo(() => {
    const pens = ['pencil', 'ephemeralPencil'];
    if (active) {
      if (pens.includes(modeSelected.id)) {
        const url = generateCircleSVG(color, 4);
        return `url("${url}") 4 4, auto`;
      }
    }

    return 'default';
  }, [modeSelected, active, color]);

  useEffect(() => {
    const video = videoElRef.current;
    if (!enabled) return;
    video.srcObject = null;
    video.srcObject = getData('stream');

    const handleVideoPlay = () => {
      const layer = videoLayerRef.current;
      if (layer) {
        video.play();
        const anim = new window.Konva.Animation(() => {}, layer);
        animationRef.current = anim;
        anim.start();
      }
    };
    const handleEnd = () => {
      animationRef.current?.stop();
    };

    video.addEventListener('loadedmetadata', handleVideoPlay);
    return () => {
      video.removeEventListener('loadedmetadata', handleVideoPlay);
      handleEnd();
    };
  }, [getData, enabled]);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      ref={containerRef}
    >
      <Box
        position={'absolute'}
        id="local-presentation-video-layer"
        onContextMenu={(e) => e.preventDefault()}
        top={offsetY}
        left={offsetX}
        width={width}
        height={height}
        sx={{ cursor }}
      >
        <DrawingStageProvider
          width={width}
          height={height}
          scaleX={scaleX}
          scaleY={scaleY}
          ref={stageRef}
        >
          <Layer id="video-layer" ref={videoLayerRef} listening={false}>
            <Image
              image={videoElRef.current}
              listening={false}
              x={0}
              y={0}
              width={width / scaleX}
              height={height / scaleY}
            />
          </Layer>
          <Layer id="drawing-area-layer" draggable={false}>
            <DrawingArea />
          </Layer>
          <Layer id="ephemeral-pencil-layer" draggable={false}>
            <EphemeralPencil />
          </Layer>
        </DrawingStageProvider>
      </Box>
    </Box>
  );
};

const generateCircleSVG = (color, radius = 3, strokeWidth = 1) => {
  const size = radius * 2;
  const r = Math.max(0, radius - strokeWidth / 2);
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
      <defs>
        <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='1' dy='1' stdDeviation='1' flood-color='rgba(0,0,0,0.3)'/>
        </filter>
      </defs>
      <circle cx='${radius}' cy='${radius}' r='${r}' fill='${color}' stroke='white' stroke-width='${strokeWidth}' filter='url(#shadow)'/>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

DrawingLayer.propTypes = {
  stageRef: PropTypes.object,
};

export default React.memo(DrawingLayer);
