import { 
    Stack, 
    Box as MuiBox,
    ListItem,
    Divider,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '@emotion/react';
import { useData } from '../../../../../../utils/DataProvider';
import AvatarVoice from './AvatarVoice';
import VoiceControls from './VoiceControls';
import { useSelector } from 'react-redux';
import getServerUri from '../../../../../../utils/getServerUri';

export default function VoiceMessage ({bgcolor, buffer:bf, content, id, isMine, name:nm, avatarSrc}) {
   const user = useSelector(store => store.user);
   const [{downloadsRef, voicesRef}] = useData();
   const [buffer, setBuffer] = useState(bf);
   const urlRef = useRef(buffer && URL.createObjectURL(buffer));
   const [download, setDownload] = useState(null);
   
   const [voiceData, setVoiceData] = useState(
    voicesRef?.current?.find(
        data => data?.id === id) ||
        (() => {
        const audio = new Audio();
        audio.preload = "metadata";
        audio.src = urlRef.current || getServerUri({pathname: content});
        return {audio, id, currentTime: 0, duration: 0 };
    })
   );
   const theme = useTheme();
   const avatar = useMemo(() => isMine ? user?.image :  avatarSrc, [avatarSrc, isMine, user?.image]);
   const name = useMemo(() => isMine ? `${user?.fistName} ${user?.name}` : nm, [nm, user, isMine]);

   useLayoutEffect(() => {
       const download = downloadsRef.current?.find(data => data.id === id);
       if(download) setDownload(download);
   }, [downloadsRef, id]);

   return (
       <ThemeProvider theme={isMine ? createTheme({palette: {mode : 'light'}}) : theme}>
         <Stack 
            bgcolor={bgcolor} 
            width={330} 
            display="flex" 
            pb={1} 
            divider={<Divider/>}
        >
           <ListItem 
               secondaryAction={null} 
               sx={{flexDirection: 'row-reverse'}}
           >
               <AvatarVoice
                    voiceData={voiceData}
                    name={name}
                    avatarSrc={avatar}
               />
               <VoiceControls
                    voiceData={voiceData}
               />
            </ListItem>
         </Stack>
       </ThemeProvider>
   );
}