// import ImageContent from "../views/main-view/view-content-box/media-viewer/media-viewer-content/ImageContent";
// import src from "../assets/_DSC7640.webp";
// import HandWave from "./HandWave";
import { Box } from "@mui/material";
import AudioThumbnail from "../views/main-view/view-content-box/messaging-box/messaging-box-footer/files-thumbnail-view/audio-thumbnail/AudioThumbnail";
//import DocReader from "./DocReader";
//import AudioPlayView from "../components/AudioPlayView";
import link_audio from "../assets/outgoing_call.wav";

const AppTest = () => {
  return (
    <>
      <Box
        position='relative'
        display='flex'
        flex={1}
        justifyContent='center'
        alignItems='center'
        overflow='hidden'>
        <AudioThumbnail src={link_audio} />
      </Box>
    </>
  );
};

export default AppTest;
