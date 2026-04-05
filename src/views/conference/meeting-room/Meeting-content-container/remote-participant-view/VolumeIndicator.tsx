import Box from "@mui/material/Box";
import { useRTCClient } from "agora-rtc-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { generateColorsFromId } from "../../../../../utils/genColorById";

const VolumeIndicator = ({ id }) => {
  const client = useRTCClient();
  const [selected, setSelected] = useState(false);
  const uid = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.uid
  );
  const color = useMemo(() => generateColorsFromId(id).background, [id]);

  useEffect(() => {
    const threshold = 15;
    const handleVolumeIndicator = (volumes = []) => {
      const maxLevelUser = volumes.reduce((a, b) => {
        return a?.level > b?.level ? a : b;
      }, {});
      const s = maxLevelUser?.uid === uid && maxLevelUser?.level > threshold;
      if (selected !== s) setSelected(s);
    };
    client.on("volume-indicator", handleVolumeIndicator);
    return () => {
      client.off("volume-indicator", handleVolumeIndicator);
    };
  }, [client, uid, selected]);

  return (
    <Box
      border={selected ? `2px solid ${color}` : "none"}
      position='absolute'
      top={0}
      left={0}
      right={0}
      bottom={0}
      borderRadius={2}
      zIndex={1}
    />
  );
};
export default VolumeIndicator;
