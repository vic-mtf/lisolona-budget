import React from "react";
import { Box } from "@mui/material";
import useLocalStoreData from "../../../../../../../hooks/useLocalStoreData";
import VoiceListenerView from "../../../../../../../components/VoiceListenerView";

const VoiceThumbnail = React.forwardRef(({ src, id }, ref) => {
  const key = `app.uploads.voices.${id}`;
  const [getData, setData] = useLocalStoreData(key);
  const voice = getData();

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
        onGetRawData={({ rawData, duration }) => setData({ rawData, duration })}
      />
    </Box>
  );
});

VoiceThumbnail.displayName = "VoiceThumbnail";
export default React.memo(VoiceThumbnail);
