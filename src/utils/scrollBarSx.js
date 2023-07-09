import { alpha } from "@mui/material";

const scrollBarSx = {
    [`&::-webkit-scrollbar`]: { width: 5 },
        [`&::-webkit-scrollbar-thumb`]: { backgroundColor: 'transparent' },
        [`&:hover`]: {
            [`&::-webkit-scrollbar-thumb`]: {
                backgroundColor: theme => alpha(
                    theme.palette.common[ 
                            theme.palette.mode === 'light' ? 
                            'black' : 'white'
                    ], 0.2
                ),
                borderRadius: 5,
            },
            [`&::-webkit-scrollbar-thumb:hover`]: {
                backgroundColor: theme => alpha(
                    theme.palette.common[ 
                            theme.palette.mode === 'light' ? 
                            'black' : 'white'
                    ], 0.4
                ),
            }
    }
}

export default scrollBarSx;