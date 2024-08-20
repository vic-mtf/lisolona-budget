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

export default function Discussions() {
  const bulkDiscussions = useSelector((store) => store.data.app.discussions);
  const [category, setCategory] = useState(filterCategory[0].id);
  const [search, setSearch] = useState("");
  const discussions = useMemo(
    () =>
      bulkDiscussions?.filter(
        (item) => filterByCategory(item, category) && filterByName(item, search)
      ),
    [bulkDiscussions, category, search]
  );
  const itemContent = useCallback((_, data) => {
    return (
      <>
        <DiscussionItem
          name={data?.name}
          type={data?.type}
          image={data?.image}
          key={data.id}
          message={data?.message}
        />
      </>
    );
  }, []);

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense' disableGutters>
          <Typography variant='h6'>Discussions</Typography>
        </Toolbar>
        <InputSearch
          placeholder='Recherche'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Stack direction='row' spacing={1}>
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
