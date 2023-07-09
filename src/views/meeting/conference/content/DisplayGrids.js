import {
    Grid,
    Box as MuiBox,
    styled,
} from '@mui/material'
import { useTransition, animated } from '@react-spring/web'
import { useMemo } from 'react';
import { PackedGrid } from 'react-packed-grid'
import { useSelector } from 'react-redux';



export default function DisplayGrids ({data, isolatedGrid}) {
    const dataGrid = useMemo(() => isolatedGrid ? [isolatedGrid, ...data] : data, [data, isolatedGrid]);

    const transitions = useTransition(dataGrid, {
        from: { 
            opacity: 0,
            transform : 'scale(0)',
        },
        enter: { 
            opacity: 1,
            transform : 'scale(1)',
         },
        leave: { 
            opacity: 0,  
            transform : 'scale(0)',
        },
      })

    return (
            <MuiBox
               // bgcolor=""
                position="relative"
                width="100%"
                height="100%"
                overflow="hidden"
                
                sx={{
                    overflow: "auto",
                    "& .data-grid": {
                        width: "calc(100% - 10px)",
                        height: "calc(100% - 10px)",
                        m: '5px',
                        display: 'flex',
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'auto',
                    }
                }}
            >
                <PackedGrid
                    boxAspectRatio={16/9}
                    className="data-grid"
                    
                >
                {dataGrid.map((style, index) => (
                    <DataItem
                        key={index}
                    >
                       {/* {index} */}
                       <video
                        controls
                       />
                    </DataItem>
                ))}
   
                </PackedGrid>
            </MuiBox>
    )
}


const DataItem = styled('div')(({theme}) => ({
        backgroundColor: "gray",
        display: "flex",
        flex: 1,
        flexShrink: 0,
        minHeight: 100,
        placeContent: "center",
        width: "calc(100% - 5px)",
        height: "calc(100% - 5px)",
        margin: '2.5px',

}))
DisplayGrids.defaultProps = {
    data: [],
}