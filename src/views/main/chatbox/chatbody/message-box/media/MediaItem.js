import React, { useLayoutEffect, useMemo, useState } from 'react';
import PictureMessage from './image/PictureMessage';
import VideoMessage from './video/VideoMessage';
import LoadingMedia from './LoadingMedia';
import getServerUri from '../../../../../../utils/getServerUri';
import getFileNameAndExtension from '../doc/getFileNameAndExtension';
import getFileExtension from '../../../../../../utils/getFileExtension';

export default function MediaItem (props) {
    const [buffer, setBuffer] = useState(props.buffer);
    const Item = useMemo(() => props.type === "image" ? PictureMessage : VideoMessage, [props.type]);
    const showLoading = useMemo(() => !buffer, [buffer]);
       
    useLayoutEffect(() => {
        const { openButtonRef } = props;
        if(openButtonRef?.current)
            openButtonRef.current.disabled = showLoading;
    }, [showLoading, props]);

    return (
        <React.Fragment>
            {showLoading &&
            <LoadingMedia
                seeMore={props.seeMore}
                id={props.id} 
                url={getServerUri({pathname: props?.content})}
                type={props.type + '/' + getFileExtension(props.content)} 
                name={getFileNameAndExtension(props?.content)} 
                setBuffer={setBuffer}
            />}
            <Item
                {...props}
                buffer={buffer}
            />
        </React.Fragment>
    );
}
