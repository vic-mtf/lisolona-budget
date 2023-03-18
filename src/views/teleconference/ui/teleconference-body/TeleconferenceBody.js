import {
    Box as MuiBox, createTheme, Grid, ThemeProvider, useTheme
} from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTeleconference } from '../../../../utils/TeleconferenceProvider';
import { useTeleconferenceUI } from '../TeleconferenceUI';
import gridSystem from './gridSystem';
import MeetingStatus from './meeting-status/MeetingStatus';
import MirrorVideoFrame from './mirror-video-frame/MirrorVideoFrame';
import VideoFrame from './video-frame/VideoFrame';
import BoxGradient from '../../../../components/BoxGradient';
import Avatar from '../../../../components/Avatar';

export default function TeleconferenceBody () {
    const {show, showStatus, self} = useSelector(store => {
        const show = store.teleconference?.video;
        const self = Number(store.teleconference?.videoMirrorMode === 'grid');
        const showStatus = store.teleconference?.meetingMode !== 'on';
        return {show, showStatus, self}
    });
    const [{participants} ] = useTeleconference();
    
    const grids = useMemo(() => participants, [participants]);
    const gridNumber = useMemo(() => grids?.length + self
    ,[grids, self]);

    const sytemGrid = useMemo(() => 
        grids.length === 0 ? 12 : (12 / gridSystem[gridNumber])
    ,[grids, gridNumber]);
   
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
            {show &&
            <MirrorVideoFrame
                gridProps={{
                    xs: sytemGrid,
                    display: 'flex',
                    sx: {
                        border: theme => 
                        `.1px solid ${theme.palette.background.paper}`,
                    }
                }}
            />}
                {showStatus && <MeetingStatus/>}
                {grids.map((data, index) =>
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
                            {/* <Avatar
                                sx={{
                                    width: 70,
                                    height: 70,
                                    border: 'none',
                                    borderRadius: 1,
                                }}
                            /> */}
                        </MuiBox>
                    </Grid>
                )}
            </Grid>
        </MuiBox>
    )
}