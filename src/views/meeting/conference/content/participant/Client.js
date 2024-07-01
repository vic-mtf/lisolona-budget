import { Box as MuiBox } from "@mui/material";
import AudioTrackView from "./AudioTrackView";
import VideoTrackView from "./VideoTrackView";
import ClientFooter from "./ClientFooter";
import ClientHeader from "./ClientHeader";

export default function Client({
  name,
  avatarSrc,
  id,
  audioTrack,
  videoTrack,
  showVideo,
  reverseScreen,
}) {
  return (
    <MuiBox
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        m: 0.25,
        flex: 1,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: "hidden",
        "& video, & .audio-track": {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: reverseScreen ? "scale(-1, 1)" : "scale(1, 1)",
          objectPosition: "center",
        },
      }}>
      {showVideo && Boolean(videoTrack) && (
        <VideoTrackView videoTrack={videoTrack} />
      )}
      {!videoTrack && !showVideo && (
        <AudioTrackView audioTrack={audioTrack} id={id} avatarSrc={avatarSrc} />
      )}
      <ClientHeader audioTrack={audioTrack} id={id} />
      <ClientFooter name={name} id={id} />
    </MuiBox>
  );
}

Client.defaultProps = {
  reverseScreen: false,
  showVideo: true,
};
