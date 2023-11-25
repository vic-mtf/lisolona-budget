import {
    Box as MuiBox
} from '@mui/material';
import { useMemo } from 'react';
import InfiniteLoaderMessage from './infinite-loader-message/InfiniteLoaderMessage';
import { useData } from '../../../../utils/DataProvider';

export default function ChatArea ({target}) {
    const id = useMemo(() => target?.id, [target?.id]);
    const [{messagesRef}] = useData();
    const messages = useMemo(() => messagesRef.current[id]?.messages, [id, messagesRef]);

    return ( 
        <MuiBox
            overflow="hidden"
            display="flex"
            position="relative"
            sx={{zIndex: theme => theme.zIndex.drawer}}
            flex={1}
            key={id}
            width="100%"
        >
            <InfiniteLoaderMessage
                data={messages}
            />
        </MuiBox>
    )
}
