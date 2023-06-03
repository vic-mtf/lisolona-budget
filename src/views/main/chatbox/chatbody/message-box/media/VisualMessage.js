import { 
    Box as MuiBox,
    ImageList,
    useTheme, 
    ImageListItem,
    CardActionArea,
    Paper
} from "@mui/material";
import { useMemo } from "react";
import Typography from "../../../../../../components/Typography";
import PictureMessage from "./image/PictureMessage";
import VideoMessage from "./video/VideoMessage";
import ImageButton, { Image, ImageBackdrop } from "../../../../../../components/ImgeButton";
import resizeGrid from "./resizeGrid";
import IconButton from "../../../../../../components/IconButton";
import CircularProgressIconButton from "./CircularProgressIconButton";
import MediaItem from "./MediaItem";
import LoadingMedia from "./LoadingMedia";
import getServerUri from "../../../../../../utils/getServerUri";
import React from "react";

export default function VisualMessage ({data, bgcolor, borderRadius, onClickIMedia, isMine, sended}) {
    const theme = useTheme();
    const len = useMemo(() => data?.length, [data?.length]);
    // const loading = useMemo(() => 
    //     isMine && !sended,
    //     [isMine, sended]
    // );
 
    return (
         <MuiBox display="flex" width="100%">
            <MuiBox display="flex" width="100%">
                <Typography
                    bgcolor={bgcolor}
                    width="100%"
                    borderRadius={borderRadius}
                    display="flex"
                    flexDirection="column"
                    color={isMine ? theme.palette.text.primary : 'inherit'}
                    position="relative"
                    textOverflow="ellipsis"
                >
                <MuiBox
                    component="div"
                    mx={.25}
                    sx={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        wordBreak: "break-word",
                        overflow: 'hidden',
                        position: 'relative',
                        ...isMine ? {
                            "&:after": {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: 30,
                                background: theme => 
                                `linear-gradient(90deg, transparent, transparent, transparent, ${bgcolor})`,
                                boxSizing: 'inherit',
                                zIndex: 2,
                            },
                        } : {}
                    }}
                >
                    {/* {loading && <LoadingMedia/>} */}
                    {<ImageList
                        sx={{
                            maxWidth: 330,
                            maxHeight: 330,
                            overflow: 'clip',
                            borderRadius,
                            my: .25,
                            p: 0,
                        }}
                        rowHeight="auto"
                        gap={1}
                    >
                    {data?.slice(0, 4).map((item, index, items) => {
                    const {cols, rows, ...otherProps} = resizeGrid(index, len);
                    const openButtonRef = React.createRef();
                    return (
                        <ImageListItem
                            key={index} 
                            cols={cols}
                            rows={rows}
                            sx={{
                                borderRadius: 1,
                                overflow: 'clip',
                            }}
                        > {(len > 4 && index === 3) ?
                            <ImageButton
                                focusRipple
                                style={{
                                    width: otherProps.width,
                                    height: otherProps.height,
                                }}
                                onClick={() => onClickIMedia(item)}
                                LinkComponent="div"
                                ref={openButtonRef}
                            >
                                <MediaItem
                                    {...item}
                                    {...otherProps}
                                    bgcolor={bgcolor}
                                    seeMore={len - 4}
                                    openButtonRef={openButtonRef}
                                />
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                                <Image>
                                <Typography
                                    component="span"
                                    variant="subtitle1"
                                    color="inherit"
                                    sx={{
                                    position: 'relative',
                                    }}
                                >
                                    +{len - 4}
                              </Typography>
                            </Image>
                          </ImageButton> :
                         (<CardActionArea
                            onClick={() => onClickIMedia(item)}
                            ref={openButtonRef}
                         >
                            <MediaItem
                                {...item}
                                {...otherProps}
                                url={getServerUri({pathname: item?.content})}
                                openButtonRef={openButtonRef}
                            />
                         </CardActionArea>)
                        }
                        </ImageListItem>
                    );
                    })}
                    </ImageList>}
                </MuiBox>
                </Typography>
            </MuiBox>
        </MuiBox>
    );
}