import Box from "../../../../components/Box";
import scrollBarSx from "../../../../utils/scrollBarSx";
import useShadow from "./useShadow";
import { VariableSizeList  } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import useScroll from "./contact-list-form/useScroll";

export default function CustomList ({itemCount, rowRenderer, getItemSize, sx,...otherProps}) {
    const [show, onScroll] = useScroll();
    const shadow = useShadow();

    return (
        <Box 
            overflow="hidden" 
            sx={{
                boxShadow: show ? shadow : 0,
                "& .MuiList-dense": {
                    overflow: 'auto',
                    height: "100%",
                    width: 'auto',
                    ...scrollBarSx,
                    ...sx,
                },
            }}
        >
            <AutoSizer
                className="MuiList-root"
            >
                {({ height, width }) => (
                    <VariableSizeList
                        className="MuiList-root MuiList-dense"
                        height={height}
                        itemCount={itemCount}
                        itemSize={getItemSize}
                        width={width}
                        onScroll={onScroll}
                        {...otherProps}
                    >
                        {rowRenderer}
                    </VariableSizeList>
                )}
            </AutoSizer>
        </Box>
    );
}

CustomList.defaultProps = {
    getItemSize: () => 70,
}