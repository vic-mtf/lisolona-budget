import {
    Box as MuiBox, 
    Grid
} from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../../../utils/TeleconferenceProvider';
import gridSystem from './gridSystem';
import MeetingStatus from './meeting-status/MeetingStatus';
import MirrorVideoFrame from './mirror-video-frame/MirrorVideoFrame';
import VideoFrame from './video-frame/VideoFrame';

export default function TeleconferenceBody () {
    const videoMirrorMode = useSelector(store => store.teleconference?.videoMirrorMode);
    const priorityTargetId = useSelector(store => store.teleconference?.priorityTargetId);
    const mode = useSelector(store => store.teleconference?.mode);

    const self = useMemo(() => Number(videoMirrorMode === 'grid'),[videoMirrorMode]);
    const showStatus = useMemo(() => mode !== 'on', [mode]);

    const [{participants} ] = useTeleconference();
    const grids = useMemo(() => {
        const users = priorityTargetId ? 
        [participants.find(({tracks}) => tracks.uid === priorityTargetId)] :
        participants
        return users;
    }, [participants, priorityTargetId]);

    const gridNumber = useMemo(() => grids?.length + self
    ,[grids, self]);

    const sytemGrid = useMemo(() => 
        (grids.length === 0 || showStatus) ? 
        12 : (12 / gridSystem[gridNumber])
    ,[grids, gridNumber, showStatus]);
    
    //(participants);

    return (
        <MuiBox
            display="flex"
            overflow="hidden"
            flex={1}
            flexGrow={1}
        >
            <Grid 
                container 
                position="relative" 
                width="100%" 
                display="flex"
                justifyContent="center"
            >
                <MirrorVideoFrame
                    gridProps={{
                        xs: sytemGrid,
                        display: 'flex',
                        sx: {
                            border: theme => 
                            `.1px solid ${theme.palette.background.paper}`,
                        }
                    }}
                />
                {showStatus ? 
                (<MeetingStatus/>) :
                grids.map((data, index) =>
                    <Grid
                        item
                        key={index}
                        xs={sytemGrid}
                        display="flex"
                        sx={{
                            border: theme => 
                            `.1px solid ${theme.palette.background.paper}`,
                        }}
                    >

                        <MuiBox
                            display="flex"
                            flex={1}
                            borderRadius={1}
                            justifyContent="center"
                            alignItems="center"
                            sx={{overflow: 'hidden', bgcolor: '#09162a'}}
                        >
                            <VideoFrame data={data}/>
                        </MuiBox>
                    </Grid>
                )}
            </Grid>
        </MuiBox>
    )
}