import React from "react";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import VoiceListenerView from "../../../../../../../components/VoiceListenerView";

const VoiceThumbnail = React.forwardRef(({ src, id }, ref) => {
  const key = `app.uploads.voices.${id}`;
  const [getData, setData] = useLocalStoreData();
  const voice = getData(key);
  return (
    <Box
      display='flex'
      width={250}
      flexDirection='row'
      gap={2}
      ref={ref}
      height={60}
      alignItems='center'
      px={1}>
      <VoiceListenerView
        src={src}
        file={voice?.file}
        rawData={voice?.rawData}
        onGetRawData={(rawData) => setData(key, { rawData, ...voice })}
      />
    </Box>
  );
});

VoiceThumbnail.displayName = "VoiceThumbnail";
VoiceThumbnail.propTypes = {
  src: PropTypes.string,
  id: PropTypes.string,
};

export default React.memo(VoiceThumbnail);
