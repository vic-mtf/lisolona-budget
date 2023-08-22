import store from "../../../redux/store";
import { useData } from "../../../utils/DataProvider";
import { useMeetingData } from "../../../utils/MeetingProvider";

export default function useJoinedAndPublishedLocalClient () {
    const [{client}] = useData();
    const [{localTrackRef}] = useMeetingData();
    const handleUserJoinedAndPublished = async ({APP_ID, TOKEN, CHANEL, uid}, published = true) => {
        const data = {};
        if(uid) 
            try {
                await client.join(APP_ID, CHANEL, TOKEN, uid);
                const tracks = [];
                const camera = store.getState().meeting.camera;
                const micro = store.getState().meeting.micro;
                data.joined = true;
                if(micro.active && published) {
                    tracks.push(localTrackRef?.current?.audioTrack);
                    data.micro = {published};
                }
                if(camera.active && published) {
                    tracks.push(localTrackRef?.current?.videoTrack);
                    data.camera = {published};
                }
                if(tracks.length) await client.publish(tracks);
            } catch (e) {}
        return data;
    };
   return handleUserJoinedAndPublished;
}