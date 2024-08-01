import { useEffect, useRef } from "react"
import { useSelector } from "react-redux";

import Typography from "../../../../components/Typography";
import VideocamOffOutlinedIcon from '@mui/icons-material/VideocamOffOutlined';


export default function CameraPreview () {
    const camera = useSelector(store => store.meeting.camera);
    const [{videoStreamRef}] useLocalStoreData();
    const videoRef = useRef();

    useEffect(() => {
        const video = videoRef.current;
        const stream = videoStreamRef.current;
        if(video) video.srcObject = stream;
    },[camera, videoStreamRef]);

    return ( camera.active ?
        (
        <video
            ref={videoRef}
            muted
            autoPlay
        />
        ) : (
            <>
                <VideocamOffOutlinedIcon
                    sx={{
                        fontSize: 60,
                        color: "text.secondary"
                    }}
                />
                <Typography
                    color="text.secondary"
                    variant="body1"
                >
                    Caméra désactivée
                </Typography>
            </>
        )
    );
} 