import PropTypes from "prop-types";
import { Box } from "@mui/material";
import ZoomViewerContent from "./ZoomViewerContent";

const ImageContent = ({ src, mode = "normal" }) => {
  return (
    <Box
      position='absolute'
      display='flex'
      height='100%'
      width='100%'
      top={0}
      left={0}
      justifyContent='center'
      alignItems='center'
      overflow='hidden'
      component={ZoomViewerContent}
      mode={mode}>
      <img
        src={src}
        loading='lazy'
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </Box>
  );
};

ImageContent.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(URL)]),
  mode: PropTypes.oneOf(["normal", "zoom"]),
};

export default ImageContent;
