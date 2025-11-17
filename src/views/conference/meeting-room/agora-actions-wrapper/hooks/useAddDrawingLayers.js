import { useEffect } from 'react';
// import useSocket from '../../../../../hooks/useSocket';
// import { videoLayerComposer } from '../../../../../utils/CanvasStreamComposer';
import { useSelector } from 'react-redux';
// import { useRTCScreenShareClient } from 'agora-rtc-react';
// import AgoraRTC from 'agora-rtc-react';
// import useLocalStoreData from '../../../../../hooks/useLocalStoreData';

let adding = false;

const useAddDrawingLayers = (stageRef) => {
  // const enabled = useSelector(
  //   (store) => store.conference.setup.devices.screen.enabled
  // );
  // useEffect(() => {
  //   const stage = stageRef?.current;
  //   if (!stage || !enabled || adding) return;
  //   const mepLager = (layer) => layer.getCanvas()?._canvas;
  //   const canvases = stage.getLayers().map(mepLager);
  //   console.log('canvases => ', canvases);
  //   const onLayersUpdated = () => {
  //     adding = false;
  //     console.log('layersUpdated with success');
  //   };
  //   videoLayerComposer.addLayers(...canvases);
  //   adding = true;
  //   videoLayerComposer.addEventListener('layersUpdated', onLayersUpdated);
  //   return () => {
  //     videoLayerComposer.removeEventListener('layersUpdated', onLayersUpdated);
  //     videoLayerComposer.clearLayers();
  //   };
  // }, [stageRef, enabled]);
};

export default useAddDrawingLayers;
