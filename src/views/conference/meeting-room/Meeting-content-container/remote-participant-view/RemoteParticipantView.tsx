import React, { useMemo } from "react";
import Box from "@mui/material/Box";
// import { useSelector } from "react-redux";
import RemoteMuteMicro from "./RemoteMuteMicro";
import FooterInfo from "./FooterInfo";
import useLocalStoreData from "../../../../../hooks/useLocalStoreData";
import { darkGradientFromId } from "../../../../../utils/color";
import RemoteVideoStream from "./RemoteVideoStream";
import { useSelector } from "react-redux";
import VolumeIndicator from "./VolumeIndicator";
// import RemoteMoreOptions from "./RemoteMoreOptions";
import RemoteOptions from "./RemoteOptions";

const RemoteParticipantView = ({ id }) => {
  const [getData] = useLocalStoreData("app.downloads.images");
  const image = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity?.image
  );
  const src = useMemo(() => getData(id) || image, [getData, id, image]);
  const showVideo = useSelector(
    (store) =>
      store.conference.meeting.actions.liveInteractionGrid.participant.hide?.[
        id
      ] !== "video"
  );

  return (
    <>
      <Box
        position='absolute'
        sx={{ ...(!src && darkGradientFromId(id)) }}
        top={0}
        left={0}
        right={0}
        bottom={0}>
        <RemoteVideoStream id={id} show={showVideo} />
        <RemoteMuteMicro id={id} />
        <FooterInfo id={id} />

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
      <VolumeIndicator id={id} />
      <RemoteOptions id={id} />
    </>
  );
};

export default React.memo(RemoteParticipantView);
