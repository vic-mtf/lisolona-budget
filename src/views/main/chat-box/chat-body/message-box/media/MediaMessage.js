import React, { useCallback, useState } from "react";
import { } from "@mui/material";
import AudioMessage from "./audio/AudioMessage";

import VisualMessage from "./VisualMessage";
import MediaReader from "./MediaReader";
import getServerUri from "../../../../../../utils/getServerUri";

export default function MediaMessage ({data, type, bgcolor, borderRadius, target, isMine, sended}) {
    const [audio] = Array.isArray(data) ? data: [];
    const [defaultValue, setDefaultValue] = useState(null);
    const handleCloseReader = useCallback(() => setDefaultValue(null), []);
    const handleClickIMedia = useCallback((media) => setDefaultValue(media), []);

    return (
        <React.Fragment>
            {type === 'audio' ? 
            <AudioMessage 
                data={audio} 
                borderRadius={borderRadius}
            /> : 
            <VisualMessage
                data={data} 
                bgcolor={bgcolor} 
                borderRadius={borderRadius}
                onClickIMedia={handleClickIMedia}
                isMine={isMine}
                sended={sended}
            />}
            <MediaReader
                defaultValue={defaultValue}
                onClose={handleCloseReader}
                target={target}
            />
        </React.Fragment>
    );
}