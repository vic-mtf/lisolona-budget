
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import path from 'path-browser';

export default function useMeetingUrl() {
    const meetingId = useSelector(store => store.meeting.meetingId);
    const url = useMemo(() => 
        path.join(
            window.location.origin.trim(), 
            process.env.PUBLIC_URL.trim(),  
            `/home?code=${meetingId}`
        ),
        [meetingId]
    );
    return url;
}