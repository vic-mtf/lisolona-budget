import React from 'react';
import { 
    List, 
} from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import useShadow from './useShadow';
// import timeHumanReadable from '../../../../utils/timeHumanReadable';
import scrollBarSx from '../../../../utils/scrollBarSx';
import { useSelector } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';


export default function CallContactsList ({search, navigation}) {
    const [atEnd, scrollProps] = useScrollEnd();
    const shadow = useShadow();
    
    const calls = []
    const currentCalls = useSelector(store => store?.teleconference?.currentCalls);
    const allCalls  = [...calls || [], ...currentCalls || []];
    
    return ( navigation === 1 &&
        <Box 
            overflow="hidden" 
            boxShadow={atEnd ? 0 : shadow}
            sx={{transition: "box-shadow 0.2s"}}
        >
            <List
                dense
                {...scrollProps}
                sx={{
                    overflow: 'auto',
                    height: "100%",
                    width: 'auto',
                    ...scrollBarSx,
                    '& ul': { padding: 0 },
                }}
            >
                <LoadingList 
                    loading={allCalls === null} 
                    lengthItem={9}
                />
                <EmptyContentMessage
                    title="Journal d'appels vide"
                    show={allCalls?.length === 0}
                    description={`
                        Informations relatives à vos appels 
                        de façons détaillée s'affichent dans cette section
                        pour une parfaite traçabilité des échanges.`
                    }
                />
                {
                // currentCalls?.map((contact, index) => (
                //     <React.Fragment key={contact.id}>
                //         <CurrentCallContactItem
                //             {...contact}
                //             date={timeHumanReadable(contact?.createdAt)}
                //         />
                //         {index !== allCalls.length - 1 && 
                //         <Divider variant="inset" component="li" />
                //         }
                //     </React.Fragment>
                // ))
            } 
            {
                // calls.map((contact, index) => (
                //     <React.Fragment key={contact._id}>
                //         <CallContactItem 
                //             {...contact}
                //             date={timeHumanReadable(
                //                 Date.now() - (Math.random() * 2592 * (10**6)),
                //                 true,
                //                 {showDetail: true}
                //             )}
                //             type={['incoming', 'missed', 'outgoing'][Math.round(Math.random() * 3)]}
                //             format={Math.random() > .5 ? 'video' : 'audio'}
                //         />
                //         {index !== calls.length - 1 && 
                //         <Divider variant="inset" component="li" />
                //         }
                //     </React.Fragment>
                // ))
            } 
            </List>
        </Box>
    );
}