import {
    CircularProgress,
    Fade,
    Grid,
    Box as MuiBox,
    ThemeProvider,
    createTheme
} from '@mui/material';
import findGrid from '../../../utils/findGrid';
import { useTeleconference } from '../../../utils/useTeleconferenceProvider';
import CallStatus from './CallStatus';
import VideoMiror from './VideoMiror';
import VideoFrame from './VideoFrame';
import { maxScreen } from '../Container';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Typography from '../../../components/Typography';

export default function Body ({page}) {
    const { calls, pickedUp, isCompatible, loading } = useTeleconference();
    const { type } = useSelector(store => {
        const type = store.teleconference?.type;
        console.log(type)
        return { type };
    });

    const clients = useMemo(() => { 
        const _calls = [...calls].filter((call, index) => 
            !(type === 'audio' && index === 0)
        );
         return  _calls?.slice((page - 1) * maxScreen, page * maxScreen)
    },[page, calls, type]);
    
    return (
        <Grid
            container
            height="100%"
            width="100%"
            display="flex"
            flex={1}
            component="div"
            spacing={clients?.length === 0 ? 0 : .2}
            overflow="hidden"
            position="relative"
        >
          {calls?.length === 0 && <VideoMiror/>}
          {clients?.map(userStream => (
            <Grid 
                item 
                xs={findGrid(clients.length)} 
                key={userStream?.uid}
            >
                <VideoFrame 
                    userStream={userStream}
                />
            </Grid>))
            }
            {(!pickedUp && isCompatible) && <CallStatus/>}
            {loading &&
            <MuiBox
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    top:0,
                    height: '100%',
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    "& > *": {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mx: .5,
                    color: 'white',
                }}}
            >
                <div>
                    <CircularProgress
                        size={20}
                        color="inherit"
                    />
                </div>
                <Typography color="white">Chargement...</Typography>
            </MuiBox>}
        </Grid>
    )
}