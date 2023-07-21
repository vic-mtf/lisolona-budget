import React, { useCallback, useMemo, useState } from 'react';
import { 
    Divider, 
    Toolbar
} from '@mui/material';
import ChatContactItem from '../items/DiscussionItem'
import { useDispatch, useSelector } from 'react-redux';
import LoadingList from './LoadingList';
import EmptyContentMessage from './EmptyContentMessage';
import { addData } from '../../../../redux/data'
import { useLiveQuery } from 'dexie-react-hooks';
import Button from '../../../../components/Button';
import db from '../../../../database/db';
import CustomListItems from '../../../../components/CustomListItems';
import filterByKeyword from '../../../../utils/filterByKeyword';
import SearchBar from '../SearchBar';
import IconButton from '../../../../components/IconButton';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

export default function DiscussionList ({navigation}) {
    const [search, setSearch] = useState('');
    const discussions = useLiveQuery(() => 
       db?.discussions.orderBy('updatedAt')
       .filter(data => filterByKeyword(data, search)).reverse()
        .toArray()
    ,[search]);

    return (navigation === 0 &&
        <React.Fragment>
            <Toolbar variant="dense">
                <SearchBar
                   // onChangeSearch={onChangeSearch}
                   value={search}
                   onChange={event => setSearch(event.target.value)}
                />
                <IconButton>
                    <FilterListOutlinedIcon fontSize="small" />
                </IconButton>
            </Toolbar>
            <ListItems
                discussions={discussions}
                search={search}
            />  
        </React.Fragment>
    );
}

const  ListItems = ({discussions, search}) => {
    const dispatch = useDispatch();
    const id = useSelector(store => store.data.target?.id);
    const handleClickDiscussion = useCallback(data => event => {
        event?.preventDefault();
        dispatch(addData({key: 'target', data}));
    }, [dispatch]);

    const customItem = useCallback((index, contact) => {
        return (
          <div>
             <ChatContactItem 
                {...contact}
                selected={id === contact.id}
                onClick={handleClickDiscussion({
                    id: contact?.id,
                    name: contact?.name,
                    members: contact?.members,
                    lastNotice: contact?.lastNotice,
                    createdBy: contact?.createdBy,
                    avatarSrc: contact?.avatarBuffer || contact?.avatarSrc,
                    type: contact?.type,
                })}
                search={search}
            />
            {index !== discussions.length - 1 && 
            <Divider variant="inset" component="div" />
            }
          </div>
        );
    }, [discussions, handleClickDiscussion, id, search]);

    return (
        <React.Fragment> 
            <LoadingList loading={discussions === undefined}/>
            <EmptyContentMessage
                title="Aucune discussion trouvée"
                show={discussions?.length === 0}
                description={`Commencer une nouvelle discuction avec un contact.`}
            />
            
            {Boolean(discussions?.length) &&
            <CustomListItems
                data={discussions}
                itemContent={customItem}
            />
            } 
        </React.Fragment>
    )
}

