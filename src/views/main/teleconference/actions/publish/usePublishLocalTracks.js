import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function usePublishLocalTracks () {
    const [{agoraEngine, localTracks}] = useTeleconference();
    const dispatch = useDispatch();
    const handlePublishLocalTracks =  useCallback(async () => {
        if(localTracks) {
            let error = null, 
            tracks = [localTracks?.videoTrack, localTracks?.audioTrack],
            data = {key: 'loading', data: true};
            dispatch(addTeleconference(data));
            try {await agoraEngine.publish(tracks.filter(track => track));}
            catch (err) {error = 'call'}
            data = {
                key: 'data',
                data: { loading: false, error}
            };
            dispatch(addTeleconference(data));
        }
    },[localTracks, agoraEngine, dispatch]);
    return handlePublishLocalTracks;
}