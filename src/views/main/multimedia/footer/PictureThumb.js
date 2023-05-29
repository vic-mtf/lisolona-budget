import { CardMedia } from "@mui/material";

export default function PictureThumb ({src}) {
    return (
        <CardMedia
            sx={{
                height: 65,
                width: 65,
            }}
            component="img"
            height={65}
            width={65}
            src={src}
            loading="lazy"
        />
    )
}