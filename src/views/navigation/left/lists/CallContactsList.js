import React from 'react';
import { 
    // alpha, 
    // Divider, 
    List, 
    Stack 
} from '@mui/material';
import useScrollEnd from '../../../../utils/useScrollEnd';
import Box from '../../../../components/Box';
import useShadow from './useShadow';
// import CallContactItem from '../contacts/CallContactItem';
// import timeHumanReadable from '../../../../utils/timeHumanReadable';
import scrollBarSx from '../../../../utils/scrollBarSx';
import Typography from '../../../../components/Typography';
import { useSelector } from 'react-redux';
import LoadingContactItem from '../contacts/LoadingContactItem';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';


export default function CallContactsList () {
    const [atEnd, scrollProps] = useScrollEnd();
    const shadow = useShadow();
    const calls = useSelector(store => 
        store?.data?.calls
    );

    return (
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
                    loading={calls === null} 
                    lengthItem={9}
                />
                <EmptyContentMessage
                    title="Journal d'appels vide"
                    show={calls?.length === 0}
                    description={`
                        Informations relatives aux appels vidéo et audio (entrants et sortants) 
                        de façons détaillée s'affichent dans cette section
                        pour assurer une parfaite traçabilité des échanges.`
                    }
                />
            {/* {
                contacts.map((contact, index) => (
                    <React.Fragment key={contact._id}>
                        <CallContactItem 
                            {...contact}
                            date={timeHumanReadable(
                                Date.now() - (Math.random() * 2592 * (10**6)),
                                true,
                                {showDetail: true}
                            )}
                            type={['incoming', 'missed', 'outgoing'][Math.round(Math.random() * 3)]}
                            format={Math.random() > .5 ? 'video' : 'audio'}
                        />
                        {index !== contacts.length - 1 && 
                        <Divider variant="inset" component="li" />
                        }
                    </React.Fragment>
                ))
            }  */}

                
            </List>
        </Box>
    );
}