import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import ListAvatar from "../../../../../components/ListAvatar";
import useLocalStoreData from "../../../../../hooks/useLocalStoreData";
import getFullName from "../../../../../utils/getFullName";
import PropTypes from "prop-types";
import RemoteAudioWaveSpeaker from "./RemoteAudioWaveSpeaker";
import Fade from "@mui/material/Fade";
// import { RemoteVideoTrack } from "agora-rtc-react";
import { useVideoTrack } from "../../agora-actions-wrapper/hooks/useRemoteUsersTrack";
import { useEffect } from "react";

const RemoteVideoStream = ({ id }) => {
  const videoContainerRef = React.useRef(null);
  const isCamActive = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.state?.isCamActive
  );
  const remoteUser = useSelector(
    (store) => store.conference.meeting.participants?.[id]?.identity
  );

  const name = useMemo(() => getFullName(remoteUser).charAt(0), [remoteUser]);
  const [getData] = useLocalStoreData("app.downloads.images");

  const videoTrack = useVideoTrack(id);

  const src = useMemo(
    () => getData(id) || remoteUser?.image,
    [getData, id, remoteUser?.image]
  );

  useEffect(() => {
    if (!videoTrack) return;
    const videoContainer = videoContainerRef.current;
    const handleStateChange = () => {
      const mediaStreamTrack = videoTrack.getMediaStreamTrack();
      const { aspectRatio } = mediaStreamTrack.getSettings();
      const videoEl = videoContainer.querySelector("video");
      videoEl.style.objectFit = aspectRatio > 1 ? "cover" : "contain";
    };
    videoTrack.play(videoContainer, { fit: "cover" });
    videoTrack.on("video-state-changed", handleStateChange);
    return () => {
      videoTrack.off("video-state-changed", handleStateChange);
    };
  }, [videoTrack]);

  return (
    <>
      <Fade
        in={!isCamActive}
        appear={false}
        unmountOnExit
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Box
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent='center'
          alignItems='center'
          display='flex'
          zIndex={1}>
          <Box position='absolute' zIndex={1}>
            <ListAvatar id={id} src={src} sx={{ width: 50, height: 50 }}>
              {name}
            </ListAvatar>
          </Box>
          <RemoteAudioWaveSpeaker id={id} />
        </Box>
      </Fade>
      <Fade
        in={isCamActive}
        appear={false}
        unmountOnExit
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        <Box
          position='absolute'
          top={0}
          left={0}
          right={0}
          bottom={0}
          justifyContent='center'
          alignItems='center'
          display='flex'
          zIndex={1}>
          <Box
            ref={videoContainerRef}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              "& video": {
                width: "100%",
                height: "100%",
                position: "absolute",
              },
            }}
          />
        </Box>
      </Fade>
    </>
  );
};

RemoteVideoStream.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default React.memo(RemoteVideoStream);
