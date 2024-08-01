import { useEffect, useMemo, useState } from "react";

import CircularProgressIconButton from "./CircularProgressIconButton";
import onDownload from "./onDownload";

export default function LoadingMedia ({seeMore, id, url, type, name, setBuffer}) {
    const [{downloadsRef, messagesRef}] useLocalStoreData();
    const [loaded, setLoaded] = useState();

    const download = useMemo(() => 
        loaded !== null &&
        downloadsRef?.current?.find(data => data?.id === id)
    ,[downloadsRef, id, loaded]);

    useEffect(() => {
        const xhr = download?.xhr;
        const onProgress = event => {
            setLoaded(event.loaded);
        }
        xhr?.addEventListener('progress', onProgress);
        return () => {
            xhr?.removeEventListener('progress', onProgress);
        }
    },[download?.xhr]);

    return (
        <CircularProgressIconButton
            sx={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
                height: '100%',
                width: '100%',
            }}
            outerLabel={seeMore}
            onClick={() => {
                onDownload({id, url, type, name, setBuffer, downloadsRef})
            }}
            loading={typeof loaded === 'number'}
            CircularProgressProps={{
                value: loaded / download?.total,
                variant: typeof loaded === 'number' ? 
                'indeterminate' : 'derteminate'
            }}
        />
    );
}