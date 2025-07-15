import { Stack, Toolbar, Typography, ListSubheader } from "@mui/material";
import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import groupCall from "./groupCall";
import CreateCallButton from "./CreateCallButton";
import FilterCallButton from "./FilterCallButton";
import VirtualizedList from "../../../../components/VirtualizedList";
import RunningCallItem from "./RunningCallItem";
import ScheduledCallItem from "./ScheduledCallItem";
import CallItem from "./CallItem";
import toggleFullscreen from "../../../../utils/toggleFullscreen";

export default function Calls() {
  const bulkCalls = useSelector((store) => store.data.app.calls);
  const [type, setType] = useState("all");

  const calls = useMemo(() => groupCall(bulkCalls, type), [bulkCalls, type]);

  const itemContent = useCallback(
    ({ index, style }) => {
      const data = calls[index];
      const id = data?.id;
      const participants = data?.participants;
      const guests = data?.guests;

      return (
        <div key={id} style={style}>
          {data?.type === "label" && (
            <ListSubheader sx={{ height: "100%" }}>{data?.label}</ListSubheader>
          )}

          {data?.status === "running" && (
            <RunningCallItem
              location={data?.location}
              divider={data?.status === calls[index + 1]?.status}
              createdAt={data?.createdAt}
              createdBy={data?.createdBy}
              incoming={data?.incoming}
              participants={
                Array.isArray(participants) && Array.isArray(guests)
                  ? participants.length + guests.length
                  : undefined
              }
            />
          )}
          {data?.status === "scheduled" && (
            <ScheduledCallItem
              location={data?.location}
              divider={data?.status === calls[index + 1]?.status}
              code={data?.id}
              title={data?.title}
              description={data?.description}
              startedAt={data?.startedAt}
              endedAt={data?.endedAt}
            />
          )}

          {["started", "ended", "failed"].includes(data?.status) && (
            <CallItem
              location={data?.location}
              divider={data?.status === calls[index + 1]?.status}
              createdAt={data?.createdAt}
              // createdBy={data?.createdBy}
              calls={data?.calls?.length + 1}
              incoming={data?.incoming}
              failed={data?.status === "failed"}
              action='accepted'
            />
          )}
        </div>
      );
    },
    [calls]
  );

  return (
    <>
      <Stack spacing={1} px={1} pb={1}>
        <Toolbar variant='dense'>
          <Typography
            variant='h5'
            flexGrow={1}
            onDoubleClick={() => toggleFullscreen(document.body)}>
            Appels
          </Typography>
          <CreateCallButton />
        </Toolbar>
        <div>
          <FilterCallButton type={type} onChange={(_, type) => setType(type)} />
        </div>
      </Stack>
      <VirtualizedList
        data={calls}
        itemContent={itemContent}
        rowHeight={({ index }) => (calls[index].type === "label" ? 50 : 69)}
        emptyMessage='Aucun appel trouvé'
        key={calls.length}
      />
    </>
  );
}
