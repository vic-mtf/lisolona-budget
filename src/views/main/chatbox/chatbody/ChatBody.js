import {
    Box as MuiBox
} from '@mui/material';
import { useMemo } from 'react';
import MessagesContent from './messages-content/MessagesContent';

export default function ChatBody ({target}) {
    const id = useMemo(() => target?.id, [target?.id]);

    return ( 
        <MuiBox
            overflow="hidden"
            display="flex"
            position="relative"
            sx={{
                zIndex: theme => theme.zIndex.drawer,
            }}
            flex={1}
            key={id}
        >
            <MessagesContent target={target}/>  
        </MuiBox>
    )
}