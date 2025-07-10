import { Chip, Stack, Toolbar, Typography } from "@mui/material";
import filterCategory, { filterByCategory, sortbyKey } from "./filterCategory";
import { createElement, useState, useMemo, useCallback } from "react";
import InputSearch from "../../../../components/InputSearch";
import { useSelector } from "react-redux";
import DiscussionItem from "./DiscussionItem";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";
import VirtualizedList from "../../../../components/VirtualizedList";
import MenuDiscussionItem from "./MenuDiscussionItem";
import CreateDiscussionGroupButton from "./CreateDiscussionGroupButton.";
import toggleFullScreen from "../../../../utils/toggleFullscreen";
import { filterByName } from "../../../../utils/filterByKey";

export default function Discussions() {
  const bulkDiscussions = useSelector((store) => store.data.app.discussions);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const [menuItem, setMenuItem] = useState({ contextMenu: null, data: null });
  const [category, setCategory] = useState(filterCategory[0].id);
  const [search, setSearch] = useState("");

  const discussions = useMemo(
    () =>
      sortbyKey(
        bulkDiscussions?.filter(
          (item) =>
            filterByCategory(item, category) && filterByName(item, search)
        ),
        "update",
        false
      ),
    [bulkDiscussions, category, search]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = discussions[index];
      const id = data?.id;
      const remote = data.members.find(
        ({ id }) => id !== store.getState().user.id
      );
      const image = data.type === "room" ? data.image : remote?.image;

      return (
        <div key={id} style={style}>
          <DiscussionItem
            name={data?.name}
            image={image}
            type={data?.type}
            message={data?.message || "Nouvelle discussion"}
            status={data?.status}
            search={search}
            id={id}
            updatedAt={data?.updatedAt}
            onClick={() =>
              store.dispatch(
                updateData({
                  data: { discussionTarget: data, targetView: "messages" },
                })
              )
            }
            onContextMenu={(event) => {
              event.preventDefault();
              const [Touch] = event?.changedTouches || [];
              const mouseX = (Touch?.clientX || event?.clientX) + 2;
              const mouseY = (Touch?.clientY || event?.clientY) - 6;

              setMenuItem((item) => ({
                contextMenu:
                  item.contextMenu === null ? { mouseX, mouseY } : null,
                data,
              }));
            }}
            divider={index !== discussions.length - 1}
            selected={data.id === discussionTarget?.id}
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
            variant='h5'
            flexGrow={1}
            onDoubleClick={() => toggleFullScreen(document.body)}>
            Discussions
          </Typography>
          <CreateDiscussionGroupButton />
        </Toolbar>
        <InputSearch
          placeholder='Recherche'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Stack direction='row' spacing={0.5}>
          {filterCategory.map(({ id, label, icon, disabled }) => (
            <Chip
              key={id}
              label={label}
              color={category === id ? "primary" : "default"}
              onClick={() => setCategory(id)}
              icon={createElement(icon)}
              disabled={disabled}
              sx={{ flex: 1 }}
            />
          ))}
        </Stack>
      </Stack>
      <VirtualizedList
        data={discussions}
        itemContent={itemContent}
        rowHeight={69}
        emptyMessage='Aucune discussion trouvée'
      />
      <MenuDiscussionItem
        {...menuItem}
        discussionTarget={discussionTarget}
        onClose={() => setMenuItem({ contextMenu: null, data: null })}
      />
    </>
  );
}
