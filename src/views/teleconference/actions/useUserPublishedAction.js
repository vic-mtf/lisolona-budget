import { useEffect, useRef } from "react";
import { useTeleconference } from "../../../utils/TeleconferenceProvider";

export default function useUserPublishedAction () {
    const [{agoraEngine, participants}, {setParticipants}] = useTeleconference();
    const participantRef = useRef({
        tracks: {},
        mediaType: null,
    });

    useEffect(() => {
        const newParticipant = participantRef.current;
        const handleUserPublished = async (user, mediaType) => {
            await agoraEngine?.subscribe(user, mediaType);
            if(mediaType === 'video') {
                newParticipant.tracks.videoTrack = user.videoTrack;;
                newParticipant.tracks.uid = user.uid;
                newParticipant.mediaType = mediaType;
            }
            if(mediaType === 'audio') {
                newParticipant.tracks.audioTrack = user.audioTrack;
                newParticipant.tracks.uid = user.uid;
                newParticipant.mediaType = mediaType;
                user?.audioTrack?.play();
            }
            console.log('**********publication**********', {user, mediaType});
            setParticipants(users => {
                const participants = [...users];
                const index = participants?.findIndex(
                    participant => 
                    participant?.tracks?.uid === user?.uid
                );
                if(index === -1)
                    participants.push(newParticipant);
                else participants[index] =  newParticipant;
                return [...participants];
            }); 
        }
        const handleUserLeft = user => {
            setParticipants(users => {
                const participants = [...users].filter(
                    ({tracks}) => tracks.uid !== user.uid
                );
                console.log();
                return [...participants];
            })
        }
        const handleUserUnPublished = (user, mediaType) => {
            console.log('**********depublication**********', {audioTrack: user.audioTrack, mediaType});
        }
        agoraEngine?.on('user-published', handleUserPublished);
        agoraEngine?.on('user-unpublished', handleUserUnPublished);
        agoraEngine?.on('user-left', handleUserLeft);
        return () => {
            agoraEngine?.off('user-published', handleUserPublished);
            agoraEngine?.off('user-unpublished', handleUserUnPublished);
            agoraEngine?.off('user-left', handleUserUnPublished);
        }
    },[setParticipants, agoraEngine, participants]); 
}