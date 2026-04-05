import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ZoomButtons from "./ZoomButtons";
import { alpha, Box, Fade } from "@mui/material";

const ZoomViewerContent = ({ children, className, mode }) => {
  return (
    <TransformWrapper
      initialScale={1}
      centerOnInit
      zoomAnimation={{ size: 200 }}
      maxScale={2.5}
      disabled={mode === "normal"}>
      <Box
        position='relative'
        width='100%'
        justifyContent='center'
        display='flex'
        sx={{
          "& > .container": {
            opacity: (theme) => theme.palette.action.disabledOpacity,
            zIndex: (theme) => theme.zIndex.tooltip,
            transition: (theme) =>
              theme.transitions.create("opacity", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.shorter,
              }),
            "&:hover": { opacity: 1 },
            "& > div": {
              bottom: (theme) => theme.spacing(10),
              zIndex: (theme) => theme.zIndex.tooltip,
              borderRadius: (theme) => theme.shape.borderRadius / 2,
              // boxShadow: (theme) => theme.shadows[4],

              bgcolor: (theme) =>
                alpha(
                  theme.palette.common[
                    theme.palette.mode === "dark" ? "black" : "white"
                  ],
                  0.5
                ),
              position: "fixed",
              transition: "opacity .2s",
            },
          },
        }}>
        <div className='container'>
          <Fade in={mode === "zoom"} unmountOnExit>
            <div>
              <ZoomButtons mode={mode} />
            </div>
          </Fade>
        </div>
      </Box>
      <TransformComponent
        wrapperStyle={{ height: "100%", width: "100%" }}
        wrapperClass={className}
        contentStyle={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {children}
      </TransformComponent>
    </TransformWrapper>
  );
};

export default ZoomViewerContent;
