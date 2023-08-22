import { CardMedia } from "@mui/material";
import resizeImage from "../../../../../utils/resizeImage";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";

export default function PictureThumb ({src: url}) {
    const [src, setSrc] = useState(null);

    useLayoutEffect(() => {
        if(url) (async () => {
            const {normal} = await resizeImage({
                url, 
                quality: .5, 
                maxWidth: 100, 
                maxHeight: 100,
                scale: 2.5,
                imageSmoothingQuality: 'low',
            })
            setSrc(normal);
        })();
    }, [url]);

    return (
        <CardMedia
            sx={{
                height: 100,
                width: 100,
            }}
            component="img"
            height={100}
            width={100}
            src={src}
            loading="lazy"
        />
    )
}