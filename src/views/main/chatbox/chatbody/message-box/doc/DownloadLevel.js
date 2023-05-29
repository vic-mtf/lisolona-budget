import { useEffect, useState } from "react";
import CircularProgressWithLabel from "./CircularProgressWithLabel";
import {
    Box as MuiBox
} from '@mui/material';


export default function DownloadLevel ({xhr, loaded: ld, total}) {
    const [loaded, setLoaded] = useState(ld);
    const beforeStarted = typeof loaded !== 'number';
    useEffect(() => {
        const onProgress = event => {
            setLoaded(event.loaded);
        }
        xhr.addEventListener('progress', onProgress);
        return () => {
            xhr.removeEventListener('progress', onProgress);
        }
    },[xhr]);

    return (
        <MuiBox
            justifyContent="center"
            alignItems="center"
            display="flex"
        >
            <CircularProgressWithLabel
                variant={beforeStarted ? 'indeterminate' : 'determinate'}
                disableShrink={beforeStarted}
                value={(beforeStarted ? 0 : loaded) * 100 / total}
            />
        </MuiBox>
    );
}