import React from 'react';
import Box from '@mui/material/Box';
import { displays, filterByType, sortbyKey } from './filterCategory';
import { useState, useMemo, useCallback } from 'react';
import InputSearch from '@/components/InputSearch';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import VirtualizedList from '@/components/VirtualizedList';
import getFullName from '@/utils/getFullName';
import DiscussionItem from './DiscussionItem';
import SortButton from './SortButton';
import { filterByName } from '@/utils/filterByKey';

const DiscussionList = ({
  onClose,
  closable = true,
  secondaryAction,
  onClickItem,
  itemType = 'all',
}) => {
  const bulkDiscussions = useSelector((store) => store.data.app.discussions);
  const bulkContacts = useSelector((store) => store.data.app.contacts);
  const [sortMode, setSortMode] = useState({
    type: 'name',
    order: 'asc',
    display: itemType,
  });
  const bulkAllDiscussions = useMemo(() => {
    let contacts = [...bulkContacts];
    const allDiscussions = bulkDiscussions?.map((discussion) => {
      const contact = contacts.find(({ id }) => id === discussion?.id);
      contacts = contacts.filter(({ id }) => id !== contact?.id);
      return {
        ...contact,
        ...discussion,
      };
    });
    return allDiscussions?.concat(contacts) || [];
  }, [bulkDiscussions, bulkContacts]);

  const [search, setSearch] = useState('');

  const discussions = useMemo(() => {
    const { type, order, display } = sortMode;
    const data = bulkAllDiscussions?.filter(
      (item) => filterByName(item, search) && filterByType(item, display)
    );
    return sortbyKey(data, type, order === 'desc');
  }, [bulkAllDiscussions, search, sortMode]);

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = discussions[index];
      const id = data?.id;
      const remote = data?.members?.find(
        ({ id }) => id !== store.getState().user.id
      );
      const image = data?.type === 'room' ? data?.image : remote?.image || null;
      const name = getFullName(data);
      const onClick = (event) => {
        if (onClickItem) onClickItem(event, { name, id, ...data });
        if (closable) onClose();
      };
      return (
        <div key={id} style={style}>
          <DiscussionItem
            id={data?.id}
            name={name}
            image={image}
            status={data?.status}
            type={data?.type}
            email={data?.email}
            description={data?.description}
            onClick={onClick}
            search={search}
            divider={index !== discussions.length - 1}
            secondaryAction={
              typeof secondaryAction === 'function'
                ? secondaryAction({ name, id, ...data, onClick })
                : secondaryAction
            }
          />
        </div>
      );
    },
    [discussions, onClose, secondaryAction, onClickItem, closable, search]
  );

  return (
    <Box display="flex" flex={1} overflow="hidden" flexDirection="column">
      <Box display="flex" flexDirection="row" gap={1} px={2} pb={1}>
        <InputSearch
          placeholder="Recherche"
          sx={{ flexGrow: 1 }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <SortButton
          {...sortMode}
          itemType={itemType}
          onChange={(mode) => setSortMode((value) => ({ ...value, ...mode }))}
        />
      </Box>

      <VirtualizedList
        data={discussions}
        itemContent={itemContent}
        rowHeight={69}
        emptyMessage="Aucune discussion trouvée"
      />
    </Box>
  );
};

export default React.memo(DiscussionList);
