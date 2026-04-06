import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { darkGradientFromId } from "@/utils/color";
import useLocalStoreData from "@/hooks/useLocalStoreData";
import getFullName from "@/utils/getFullName";
import LocalMuteMicro from "./LocalMuteMicro";
import LocalVideoStream from "./LocalVideoStream";
import VolumeIndicator from "../remote-participant-view/VolumeIndicator";

const LocalParticipantGridView = () => {
  const id = useSelector((store) => store.user.id);
  const user = useSelector((store) => store.user);
  const name = useMemo(() => getFullName(user), [user]);
  const [getData] = useLocalStoreData("app.downloads.images");
  const src = useMemo(
    () => getData(user.id) || user.image,
    [getData, user.id, user.image]
  );

  return (
    <Box
      position='absolute'
      top={0}
      left={0}
      right={0}
      bottom={0}
      display='flex'
      sx={{ ...(!src && darkGradientFromId(id)) }}>
      <LocalMuteMicro />
      <LocalVideoStream />
      <VolumeIndicator id={id} />
      <Box
        sx={{
          p: 1,
          display: "flex",
          zIndex: (t) => t.zIndex.tooltip,
          position: "absolute",
          left: 0,
          bottom: 0,
        }}>
        <Typography
          sx={{ textShadow: "1px 1px 2px black", fontSize: ".8rem" }}
          variant='body2'>
          {name} (Vous)
        </Typography>
      </Box>

      {src && (
        <Box
          sx={{
            backgroundImage: `url(${src})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            filter: "blur(50px)",
            zIndex: 0,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    </Box>
  );
};

export default React.memo(LocalParticipantGridView);
