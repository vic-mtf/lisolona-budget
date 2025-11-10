import { useEffect, useState, useRef } from 'react';
// import useSocket from '../../../../../hooks/useSocket';
import { videoLayerComposer } from '../../../../../utils/VideoLayerComposer';
import { useSelector } from 'react-redux';
// import { useRTCScreenShareClient } from 'agora-rtc-react';
// import AgoraRTC from 'agora-rtc-react';
// import useLocalStoreData from '../../../../../hooks/useLocalStoreData';

// let publishing = false;

const useAddDrawingLayers = (stageRef) => {
  const enabled = useSelector(
    (store) => store.conference.setup.devices.screen.enabled
  );

  useEffect(() => {
    const stage = stageRef?.current;
    if (!stage || !enabled) return;
    const mepLager = (layer) => layer.getCanvas()?._canvas;
    const canvases = stage.getLayers().map(mepLager);
    videoLayerComposer.addLayers(...canvases);
    return () => {
      videoLayerComposer.clearLayers();
    };
  }, [stageRef, enabled]);
};

export default useAddDrawingLayers;
