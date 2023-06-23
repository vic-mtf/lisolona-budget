import React, { useCallback, useMemo, useState } from 'react';
import { 
    Divider, 
    Toolbar
} from '@mui/material';
import ChatContactItem from '../items/DiscussionItem'
import { useDispatch, useSelector } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { addData } from '../../../../redux/data';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';
import Lists from './Lists';
import { useLiveQuery } from 'dexie-react-hooks';
import LoadingItem from '../items/LoadingItem';
import Button from '../../../../components/Button';
import db from '../../../../database/db';

export default function DiscussionList ({search, navigation}) {
    const [limit, setLimit] = useState(15);
    const discussions = useLiveQuery(() => 
       db?.discussions.orderBy('updatedAt')
       .filter(({name}) =>
            new RegExp(
                search.trim().split(/\s/).join('|'),
                'ig'
            ).test(name)
        ).reverse()
        .limit(limit)
        .toArray()
    ,[search, limit]);
    const length = useMemo(() => discussions?.length, [discussions]);
    
    return (navigation === 0 &&
        <React.Fragment>
            <Toolbar variant="dense">
                
                <Button
                    children="Démarrer une discussion" 
                    variant="outlined"
                    color="inherit"
                    sx={{mx: 'auto'}}
                    startIcon={<AddCommentOutlinedIcon/>}
                    onClick={() => {
                        const name = '_auto_open_create_group';
                        const customEvent = new CustomEvent(name, {
                            detail: {name, mode: 'contact'}
                        });
                        document
                        .getElementById('root')
                        .dispatchEvent(customEvent);
                    }}
                />
            </Toolbar>
            <Lists
                onScrollEnd={(event, state) => {
                    if(state === 'down' && limit === length)
                        setLimit(limit + 5);
                }}
            >
                  <ListItems
                    discussions={discussions}
                    search={search}
                  />  
                  {limit === discussions && <LoadingItem/>}
             </Lists>
        </React.Fragment>
    );
}

const  ListItems = ({discussions, search}) => {
    const dispatch = useDispatch();
    const id = useSelector(store => store.data.target?.id);


    const handleClickDicussion = useCallback(data => event => {
        event?.preventDefault();
        dispatch(addData({key: 'target', data}));
    }, [dispatch
    ]);
    
    return (
        <React.Fragment> 
            <LoadingList loading={discussions === undefined}/>
            <EmptyContentMessage
                title="Aucune discussion trouvée"
                show={discussions?.length === 0}
                description={`Commencer une nouvelle discuction avec un contact.`}
            />
            {
                discussions?.map((contact, index, discussions) => (
                    <React.Fragment key={index}>
                        <ChatContactItem 
                            {...contact}
                            selected={id === contact.id}
                            onClick={handleClickDicussion({
                                id: contact?.id,
                                name: contact?.name,
                                members: contact?.members,
                                lastNotice: contact?.lastNotice,
                                createdBy: contact?.createdBy,
                                avatarSrc: contact?.avatarSrc,
                                type: contact?.type,
                            })}
                            search={search}
                        />
                        {index !== discussions.length - 1 && 
                        <Divider variant="inset" component="li" />
                        }
                    </React.Fragment>
                ))
            } 
        </React.Fragment>
    )
}

