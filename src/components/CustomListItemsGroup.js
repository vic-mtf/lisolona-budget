import { GroupedVirtuoso } from "react-virtuoso";
import Box from "./Box";
import scrollBarSx from "../utils/scrollBarSx";
import useShadow from "../utils/useShadow";
import useScroll from "../utils/useScroll";


export default function CustomListItemsGroup ({sx, itemContent, groupCounts, groupContent})  {
    const [show, onScroll] = useScroll();
    const shadow = useShadow();

    return (
        <Box 
            overflow="hidden" 
            sx={{
                boxShadow: show ? shadow : 0,
                "& .item-container-list": {
                    overflow: 'auto',
                    height: "100%",
                    ...scrollBarSx,
                    ...sx,
                },
            }}
        >
            <GroupedVirtuoso
                style={{ height: '100%' }}
                className="item-container-list"
                groupCounts={groupCounts}
                groupContent={groupContent}
                itemContent={itemContent}
                onScroll={onScroll}
            />
        </Box>
    );
}