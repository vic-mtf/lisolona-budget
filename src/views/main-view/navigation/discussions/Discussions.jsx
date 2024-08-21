import { Chip, Stack, Toolbar } from "@mui/material";
import filterCategory, {
  filterByCategory,
  filterByName,
} from "./filterCategory";
import { createElement, useState, useMemo, useCallback } from "react";
import InputSearch from "../../../../components/InputSearch";
import Typography from "../../../../components/Typography";
import { useSelector } from "react-redux";
import DiscussionList from "./DiscussionList";
import DiscussionItem from "./DiscussionItem";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";
import AddDiscussion from "./AddDiscussion";

export default function Discussions() {
  const bulkDiscussions = useSelector((store) => store.data.app.discussions);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const [category, setCategory] = useState(filterCategory[0].id);
  const [search, setSearch] = useState("");

  const discussions = useMemo(
    () =>
      bulkDiscussions?.filter(
        (item) => filterByCategory(item, category) && filterByName(item, search)
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
            {...data}
            image={image}
            onClick={() =>
              store.dispatch(updateData({ data: { discussionTarget: id } }))
            }
            onContextMenu={(event) => {
              event.preventDefault();
              setItem((item) => ({
                contextMenu:
                  item.contextMenu === null
                    ? {
                        mouseX: event.clientX + 2,
                        mouseY: event.clientY - 6,
                      }
                    : null,
                data,
              }));
            }}
            divider={index !== discussions.length - 1}
            selected={data.id === discussionTarget}
          />
        </div>
      );
    },
    [discussions, discussionTarget]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense'>
          <Typography variant='h6' flexGrow={1}>
            Discussions
          </Typography>
          <AddDiscussion />
        </Toolbar>
        <InputSearch
          placeholder='Recherche'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Stack direction='row' spacing={0.5}>
          {filterCategory.map(({ id, label, icon }) => (
            <Chip
              key={id}
              label={label}
              color={category === id ? "primary" : "default"}
              onClick={() => setCategory(id)}
              icon={createElement(icon)}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Stack>
      </Stack>
      <DiscussionList data={discussions} itemContent={itemContent} />
    </>
  );
}
