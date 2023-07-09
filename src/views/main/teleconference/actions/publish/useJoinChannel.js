import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeleconference } from "../../../../../redux/teleconference";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useJoinChannel() {
    const [{localTracks, agoraEngine}] = useTeleconference();
    const opts = useSelector(store => store.teleconference?.options);
    const id = useSelector(store => store.user?.id);
    const dispatch = useDispatch();
    const handleJoinChannel = useCallback(async (calback, _options) => {
        const options = _options || opts;
        if(options && localTracks) {
            const {appId, channel, channelToken} = options;
            let status, 
            data = {key: 'loading', data: true};
            dispatch(addTeleconference(data));
            try {
                await agoraEngine.join(appId, channel, channelToken, id);
                status = 'success';
                data = {key: 'joined', data: true};
            } catch (error) {
                data = {
                    key: 'date',
                    data: {loading: false, error: 'call'}
                };
                status = 'error';
            }
            if(typeof calback === 'function')
                calback(status, agoraEngine);
            dispatch(addTeleconference(data));
        }
    }, [opts, id, agoraEngine, dispatch, localTracks]);

    return handleJoinChannel;
}