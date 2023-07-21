import { Virtuoso } from "react-virtuoso";
import Box from "./Box";
import scrollBarSx from "../utils/scrollBarSx";
import useShadow from "../utils/useShadow";
import useScroll from "../utils/useScroll";


export default function CustomListItems ({sx, data, itemContent})  {
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
            <Virtuoso
                style={{ height: '100%' }}
                className="item-container-list"
                data={data}
                itemContent={itemContent}
                onScroll={onScroll}
            />
        </Box>
    );
}