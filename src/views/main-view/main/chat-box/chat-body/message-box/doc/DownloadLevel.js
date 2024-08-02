import { useLayoutEffect, useMemo, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import {
    Box as MuiBox
} from '@mui/material';


export default function DownloadLevel ({download, setDownload}) {
    const [loaded, setLoaded] = useState(download?.loaded);
    const beforeStarted = useMemo(() => typeof download?.loaded !== 'number', [download?.loaded]);
    const value = useMemo(() => 
        (beforeStarted ? 0 : (loaded || download?.loaded)) * 100 / download?.total,
        [beforeStarted, loaded, download?.loaded, download?.total]
    );
    
    useLayoutEffect(() => {
        let xhr;
       if(download) {
            xhr = download.xhr;
            const onProgress = event => {
                setLoaded(event.loaded);
            }
            const onLoaded = () => {
               setDownload(null);
            }
            xhr?.addEventListener('progress', onProgress)
            xhr?.addEventListener('load', onLoaded);
            return () => {
                xhr?.removeEventListener('progress', onProgress);
                xhr?.removeEventListener('load', onLoaded);
            }
       }
    },[download, setDownload]);

    return (
        <MuiBox
            justifyContent="center"
            alignItems="center"
            display="flex"
        >
            <CircularProgressWithLabel
                variant={beforeStarted ? 'indeterminate' : 'determinate'}
                disableShrink={beforeStarted}
                value={value}
            />
        </MuiBox>
    );
}