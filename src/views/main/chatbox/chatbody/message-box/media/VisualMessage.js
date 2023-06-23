import { 
    Box as MuiBox,
    ImageList,
    useTheme, 
    ImageListItem,
    CardActionArea,
} from "@mui/material";
import { useMemo } from "react";
import Typography from "../../../../../../components/Typography";
import ImageButton, { Image, ImageBackdrop } from "../../../../../../components/ImgeButton";
import resizeGrid from "./resizeGrid";
import MediaItem from "./MediaItem";
import getServerUri from "../../../../../../utils/getServerUri";
import React from "react";
import MessageState from "../MessageState";

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
                                position: 'relative',
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

                        {item?.isMine &&
                        <MuiBox
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: 20,
                                background: theme => 
                                `linear-gradient(90deg, transparent, transparent, transparent, ${bgcolor})`,
                                boxSizing: 'inherit',
                                zIndex: 1
                            }}
                            children={
                                <MessageState 
                                    sended={item?.sended} 
                                    timeout={item?.timeout} 
                                    createdAt={item?.createdAt}
                                /> 
                            }
                        />}
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