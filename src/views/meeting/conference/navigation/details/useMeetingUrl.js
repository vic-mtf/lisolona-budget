import Url from 'url';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export default function useMeetingUrl() {
    const meetingId = useSelector(store => store.meeting.meetingId);
    const url = useMemo(() => 
        Url.resolve(
            Url.resolve(
                window.location.origin,
                process.env.PUBLIC_URL,
            ),
            `/home?code=${meetingId}`
        ),
        [meetingId]
    );
    return url;
}