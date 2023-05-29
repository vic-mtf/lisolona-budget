import { Box as MuiBox } from "@mui/material";
import PictureItem from "../picture-item/PictureItem";
import VideoItem from "../video-item/VideoItem";

export default function CarouselItem ({subType, urls, selected, index, containerInnerRootRef}) {

    return (
        <MuiBox
            height="100%"
            width="100%"
        >
            {subType === 'video' ?
            <VideoItem
                src={urls.regular}
                containerInnerRootRef={containerInnerRootRef}
                selected={selected}
                index={index}
            /> :
            <PictureItem
                src={urls.regular}
                srcSet={urls.small}
                containerInnerRootRef={containerInnerRootRef}
                selected={selected}
                index={index}
            />}
        </MuiBox>
    );
}
