import { useCallback, useState } from "react";

export default function useMediaTracks ({type = '', tracks = []}) {
    const [mediaTracks, setMediaTracks] = useState({type, tracks});

    const addTrack = useCallback(({id, uid, track}) => {
        setMediaTracks(({type, tracks}) => ({
            type,
            tracks: tracks.concat([{
                id,
                uid,
                [type + 'Track']: track,
            }])
        }));
    },[]);
    
    const deleteTrackById = useCallback(id => {
        const index = mediaTracks.tracks.findIndex(track => track.id === id);
        if(~index) {
            const tracks = mediaTracks.tracks.filter(track => track.id !== id);
            setMediaTracks(({type}) => ({type, tracks}))
        }
    }, [mediaTracks.tracks]);

    const deleteTrackByUid = useCallback(uid => {
        const index = mediaTracks.tracks.findIndex(track => track.uid === uid);
        if(~index) {
            const tracks = mediaTracks.tracks.filter(track => track.uid !== uid);
            setMediaTracks(({type}) => ({type, tracks}));
        }
    }, [mediaTracks.tracks]);

    const toggleTrack = useCallback(({id, uid, track}) => {
        const index = mediaTracks.tracks.findIndex(track => track.id === id);
        if(~index && track) {
            const tracks = mediaTracks.tracks.map(_track => {
                let result = _track;
                if(_track.id === id)
                    result = {...result, track};
                return result;
            });
            setMediaTracks(({type}) => ({type, tracks}))
        }
        if(~index && !track) deleteTrackById(id);
        if(!~index && track) addTrack({id, uid, track});
    }, [addTrack, deleteTrackById, mediaTracks.tracks,]);

    const getTrackById = useCallback(id => {
       const data = mediaTracks.tracks.find(track => track.id === id);
        return data ? {
                ...data,
                mediaType: mediaTracks.type,
        }: null
    }, [mediaTracks]);

    const getTrackByUid = useCallback(uid => {
        const data = mediaTracks.tracks.find(track => track.uid === uid);
        return data ? {
                ...data,
                mediaType: mediaTracks.type,
        }: null
    }, [mediaTracks]);
    const getTrack = useCallback(({uid, id}) => {
        const data = mediaTracks.tracks.find(track => track.uid === uid || track.id === id);
        return data ? {
                ...data,
                mediaType: mediaTracks.type,
        }: null
    }, [mediaTracks]);

    const actions = {
        addTrack,
        deleteTrackById,
        deleteTrackByUid,
        getTrack,
        getTrackById,
        getTrackByUid,
        toggleTrack,
    };

    return [mediaTracks.tracks, actions];
}