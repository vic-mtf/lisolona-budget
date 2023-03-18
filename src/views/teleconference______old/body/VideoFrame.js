import {
    Box as MuiBox, 
    Chip, 
    createTheme
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Typography from '../../../components/Typography';
import Avatar from '../../../components/Avatar';

export default function VideoFrame ({userStream}) {
    const containerRef = useRef();
    const { name } = useSelector(store => {
        const uid = userStream.uid;
        const contact = store.user.id === uid ? 
        store.user : store.data?.contacts?.find(({id}) => id === uid);
        const name = store.user.id === uid ? 'Moi' : (contact?.name || 'Invité');
        const email = contact?.email;
        return { name, email };
    });

    useEffect(() => {
      const videoTrack = userStream?.videoTrack;
      containerRef.current?.querySelector('video')?.remove();
      videoTrack?.play(containerRef.current);
    });

    return (
            <MuiBox
                height="100%"
                ref={containerRef}
                sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    position: 'relative',
                    bgcolor: theme => theme.palette.grey[900],
                }}
            >
            <MuiBox
                position="absolute"
                height="100%"
                width="100%"
                top={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                 <Avatar
                    sx={{
                        width: 100, 
                        height: 100,
                        fontSize: 40,
                    }}
                    children={name?.charAt(0)}
                />
            </MuiBox>
            <MuiBox
                position="absolute"
                sx={{
                    zIndex: theme => theme.zIndex.drawer,
                    bottom: '5px',
                    left: '5px',
                }}
            >
              <Chip 
                size="small"
                avatar={
                    <Avatar
                        sx={{border: 'none'}}
                    />
                }
                label={
                    <Typography 
                        color={createTheme({
                            palette: { mode: 'dark'} }
                            ).palette.text.primary
                        } 
                        children={name} 
                    />
                }
              />  
            </MuiBox>
            </MuiBox>
    )
}