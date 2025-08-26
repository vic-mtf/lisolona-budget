import { useEffect } from "react";
import { useSelector } from "react-redux";
import { streamSegmenterMediaPipe } from "../../utils/StreamSegmenterMediaPipe";
import { noiseSuppressor } from "../../utils/NoiseSuppressor";

const ListerStream = () => {
  const filter = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.filter
  );
  const blurred = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.blurred
  );
  const enhanced = useSelector(
    (store) => store.conference.setup.devices.processedCameraStream.enhanced
  );
  const background = useSelector(
    (store) =>
      store.conference.setup.devices.processedCameraStream.background.enabled
  );
  const suppressor = useSelector(
    (store) =>
      store.conference.setup.devices.processedMicrophoneStream.noiseSuppressor
  );

  useEffect(() => {
    if (background) streamSegmenterMediaPipe.enableStyle("replaceBackground");
    if (blurred) streamSegmenterMediaPipe.enableStyle("blur");
    if (enhanced) streamSegmenterMediaPipe.enableStyle("enhance");
    if (filter) {
      streamSegmenterMediaPipe.enableStyle("filter");
      streamSegmenterMediaPipe.setFilterType(filter);
    }
    noiseSuppressor.toggleProcessing(suppressor);

    return () => {
      streamSegmenterMediaPipe.resetStyles();
    };
  }, [filter, blurred, enhanced, background, suppressor]);
};

export default ListerStream;
