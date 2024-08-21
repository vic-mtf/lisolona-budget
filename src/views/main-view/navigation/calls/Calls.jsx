import { Chip, Stack, Toolbar } from "@mui/material";

import { createElement, useState, useMemo, useCallback } from "react";
import InputSearch from "../../../../components/InputSearch";
import Typography from "../../../../components/Typography";
import { useSelector } from "react-redux";
// import DiscussionList from "./DiscussionList";
// import DiscussionItem from "./DiscussionItem";
import store from "../../../../redux/store";
import { updateData } from "../../../../redux/data/data";

export default function Calls() {
  const bulkCalls = useSelector((store) => store.data.app.calls);
  const discussionTarget = useSelector((store) => store.data.discussionTarget);
  const [search, setSearch] = useState("");

  const calls = useMemo(
    () => bulkCalls?.filter(() => true),
    [bulkCalls, search]
  );

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = calls[index];
      const id = data?.id;
      const remote = data.members.find(
        ({ id }) => id !== store.getState().user.id
      );
      const image = data.type === "room" ? data.image : remote?.image;

      return (
        <div key={id} style={style}>
          {/* <DiscussionItem
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
            divider={index !== calls.length - 1}
            selected={data.id === discussionTarget}
          /> */}
        </div>
      );
    },
    [calls, discussionTarget]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense'>
          <Typography variant='h6' flexGrow={1}>
            Appels
          </Typography>
        </Toolbar>
        {/* <Toolbar variant='dense'></Toolbar> */}
        <InputSearch
          placeholder='Recherche'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Stack>
      {/* <DiscussionList data={calls} itemContent={itemContent} /> */}
    </>
  );
}
