import { Chip, Stack, Toolbar, Typography, Box } from '@mui/material';
import filterCategory, { filterByCategory, sortbyKey } from './filterCategory';
import { createElement, useState, useMemo, useCallback } from 'react';
import InputSearch from '../../../../components/InputSearch';
import { useSelector } from 'react-redux';
import DiscussionItem from './DiscussionItem';
import store from '../../../../redux/store';
import { updateData } from '../../../../redux/data/data';
import VirtualizedList from '../../../../components/VirtualizedList';
import MenuItems from '../../../../components/MenuItems';
import CreateDiscussionGroupButton from './CreateDiscussionGroupButton.';
import toggleFullScreen from '../../../../utils/toggleFullscreen';
import { filterByName } from '../../../../utils/filterByKey';
import { getFilteredMenuItems } from './discussionMenuItems';
import getCoordContextMenu from '../../../../utils/getCoordContextMenu';
import useSmallScreen from '../../../../hooks/useSmallScreen';

export default function Discussions() {
  const bulkDiscussions = useSelector((store) => store.data.app.discussions);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);

  const favorites = useSelector(
    (store) => store.app.user?.[store.user.id]?.discussions?.favorites
  );
  const pins = useSelector(
    (store) => store.app.user?.[store.user.id]?.discussions?.pins
  );
  const [menuItem, setMenuItem] = useState({ contextMenu: null, data: null });
  const [category, setCategory] = useState(filterCategory[0].id);
  const [search, setSearch] = useState('');

  const discussions = useMemo(
    () =>
      sortbyKey(
        bulkDiscussions?.filter(
          (item) =>
            filterByCategory({ ...item, favorites }, category) &&
            filterByName(item, search)
        ),
        'update',
        false,
        pins
      ),
    [bulkDiscussions, category, search, favorites, pins]
  );

  const matches = useSmallScreen();

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = discussions[index];
      const id = data?.id;
      const remote = data?.members?.find(
        ({ id }) => id !== store.getState().user.id
      );
      const image = data?.type === 'room' ? data.image : remote?.image;

      return (
        <div key={id} style={style}>
          <DiscussionItem
            name={data?.name}
            image={image}
            type={data?.type}
            message={data?.message || 'Nouvelle discussion'}
            status={data?.status}
            search={search}
            id={id}
            pinned={data?.isPinned}
            updatedAt={data?.updatedAt}
            onClick={() =>
              store.dispatch(
                updateData({
                  data: { discussionTarget: data, targetView: 'messages' },
                })
              )
            }
            onContextMenu={(event) => {
              const coords = getCoordContextMenu(event);
              setMenuItem(({ contextMenu }) => ({
                contextMenu: contextMenu === null ? coords : null,
                data,
              }));
            }}
            divider={index !== discussions.length - 1}
            selected={data?.id === discussionTarget?.id}
          />
        </div>
      );
    },
    [discussions, discussionTarget, search]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar>
          <Typography
            variant="h5"
            flexGrow={1}
            onDoubleClick={() => toggleFullScreen(document.body)}
          >
            Discussions
          </Typography>
          <CreateDiscussionGroupButton />
        </Toolbar>
        <InputSearch
          placeholder="Recherche"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Box
          overflow="hidden"
          sx={{
            overflowX: 'auto',
            ...(matches && {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }),
          }}
          flexDirection="row"
          display="flex"
          gap={1}
          position="relative"
        >
          {filterCategory.map(({ id, label, icon, disabled }) => (
            <Chip
              key={id}
              label={
                typeof label === 'function'
                  ? label({ search, favorites })
                  : label
              }
              color={category === id ? 'primary' : 'default'}
              onClick={() => setCategory(id)}
              icon={createElement(typeof icon === 'function' ? icon() : icon)}
              disabled={disabled}
              sx={{ flex: 1 }}
            />
          ))}
        </Box>
      </Stack>

      <VirtualizedList
        data={discussions}
        itemContent={itemContent}
        rowHeight={69}
        emptyMessage="Aucune discussion trouvée"
      />
      <MenuItems
        {...menuItem}
        discussionTarget={discussionTarget}
        onClose={() => setMenuItem(({ data }) => ({ data, contextMenu: null }))}
        itemContent={getFilteredMenuItems}
      />
    </>
  );
}
