import ImageContent from "../views/main-view/view-content-box/media-viewer/media-viewer-content/ImageContent";
import src from "../assets/_DSC7640.webp";
import HandWave from "./HandWave";
import { Box } from "@mui/material";
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
        <ImageContent src={src} mode='zoom' />
      </Box>
    </>
  );
};

export default AppTest;
