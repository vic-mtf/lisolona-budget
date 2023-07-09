import { useEffect } from "react";
import { useTeleconference } from "../../../../../utils/TeleconferenceProvider";

export default function useUserJoinChannelAction () {
    const [{agoraEngine, participants}, {setParticipants}] = useTeleconference();
    
    useEffect(() => {
        const handleUserJoined = user => {
            const newParticipant = {
                tracks: {
                    uid: user.uid,
                    audioTrack: user.audioTrack,
                    videoTrack: user.videoTrack,
                }, 
                mediaType: null, 
                user,
                uid: user.uid,
            };
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
                        ...oldParticipant,
                        ...newParticipant, 
                    };
                }
                return [...participants];
            }); 
        }
            agoraEngine?.on('user-joined', handleUserJoined);
        return () => {
            agoraEngine?.off('user-joined', handleUserJoined);
        }
    },[setParticipants, agoraEngine, participants]); 
}