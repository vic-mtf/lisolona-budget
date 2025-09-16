import React from "react";
import Box from "@mui/material/Box";
import GridLayoutView from "../../../../../components/GridLayoutView";
import { useEffect } from "react";
import { useMemo } from "react";
import useActiveParticipants from "../../agora-actions-wrapper/hooks/useActiveParticipants";
import getFullName from "../../../../../utils/getFullName";

const LiveInteractionGridView = React.forwardRef((_, ref) => {
  const participants = useActiveParticipants();

  const data = useMemo(() => {
    let arr = [];
    for (let i = 0; i < participants.length; ++i) {
      const name = getFullName(participants[i].identity);
      const id = participants[i].identity.id;

      arr.push({
        id,
        children: <RenderComponent key={id} name={name} />,
      });
    }
    return arr;
  }, [participants]);

  return (
    <Box
      width={"100%"}
      height={"100%"}
      ref={ref}
      display='flex'
      overflow='hidden'>
      {data?.length > 0 && <GridLayoutView data={data} />}
    </Box>
  );
});

const RenderComponent = React.memo(({ name }) => {
  useEffect(() => {
    console.log("render component ", name);
  }, [name]);
  return `user: ${name}`;
});
RenderComponent.displayName = "RenderComponent";

LiveInteractionGridView.displayName = "LiveInteractionGridView";
export default React.memo(LiveInteractionGridView);
