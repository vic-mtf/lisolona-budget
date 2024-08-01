import { Virtuoso } from "react-virtuoso";
import Box from "./Box";
import useShadow from "../hooks/useShadow";
import useScroll from "../hooks/useScroll";

export default function CustomListItems({ sx, data, itemContent }) {
  const [show, onScroll] = useScroll();
  const shadow = useShadow();

  return (
    <Box
      overflow='hidden'
      sx={{
        boxShadow: show ? shadow : 0,
        "& .item-container-list": {
          overflow: "auto",
          height: "100%",
          ...sx,
        },
      }}>
      <Virtuoso
        style={{ height: "100%" }}
        className='item-container-list'
        data={data}
        itemContent={itemContent}
        // topItemCount={2}
        onScroll={onScroll}
      />
    </Box>
  );
}
