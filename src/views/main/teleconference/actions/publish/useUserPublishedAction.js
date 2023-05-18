import { useEffect } from "react";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useUserPublishedAction () {
    const [{agoraEngine, participants}, {setParticipants}] = useTeleconference();
    useEffect(() => {
        const handleUserPublished = async (user, mediaType) => {
            await agoraEngine?.subscribe(user, mediaType);
            const newParticipant = {tracks: {}, mediaType: null};
            if(mediaType === 'video') {
                newParticipant.tracks.videoTrack = user.videoTrack;
                newParticipant.tracks.audioTrack = user.audioTrack;
                newParticipant.tracks.uid = user.uid;
                newParticipant.uid = user.uid;
                if(!newParticipant.mediaType)
                    newParticipant.mediaType = mediaType;
            }
            
            if(mediaType === 'audio') {
                newParticipant.tracks.audioTrack = user.audioTrack;
                newParticipant.tracks.uid = user.uid;
                newParticipant.uid = user.uid;
                if(!newParticipant.mediaType)
                    newParticipant.mediaType = mediaType;
            }

            setParticipants(users => {
                const participants = [...users];
                const index = participants?.findIndex(
                    participant => participant?.uid === user?.uid
                );
                if(index === -1)
                    participants.push(newParticipant);
                else {
                    const oldParticipant = participants[index];
                    participants[index] =  {
                        ...newParticipant, 
                        mediaType: oldParticipant.mediaType,
                        tracks: {
                            ...oldParticipant.tracks,
                            ...newParticipant.tracks,
                        }
                    };
                }
                return [...participants];
            }); 
        }
        const handleUserLeft = user => {
            setParticipants(users => {
                const participants = [...users].filter(({uid}) => uid !== user.uid);
                return [...participants];
            })
        }
        const handleUserUnPublished = (user, mediaType) => {
            if(mediaType === 'video') {
                setParticipants(users => {
                    const participants = [...users];
                    const index = participants?.findIndex(
                        participant => participant?.uid === user?.uid
                    );
                    if(index !== -1) {
                        const oldParticipant = participants[index];
                        delete oldParticipant.tracks?.videoTrack;
                        participants[index] =  {
                            ...oldParticipant,
                            mediaType: oldParticipant.mediaType,
                            tracks: {
                                ...oldParticipant.tracks,
                                audioTrack: user.audioTrack,
                                videoTrack: undefined,
                            }
                        };
                    };
                    return [...participants];
                }); 
            }
            if(mediaType === 'audio') {
                setParticipants(users => {
                    const participants = [...users];
                    const index = participants?.findIndex(
                        participant => participant?.tracks?.uid === user?.uid
                    );
                    if(index !== -1) {
                        const oldParticipant = participants[index];
                        delete oldParticipant.tracks?.audioTrack;
                        participants[index] =  {
                            ...oldParticipant,
                            mediaType: oldParticipant.mediaType,
                            tracks: {
                                ...oldParticipant.tracks,
                                videoTrack: user.videoTrack,
                            }
                        };
                    }
                    return [...participants];
                }); 
            }
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