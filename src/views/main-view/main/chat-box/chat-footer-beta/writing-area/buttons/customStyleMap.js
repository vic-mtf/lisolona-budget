import { alpha } from "@mui/material";

export default function customStyleMap ({theme}) {
    return {
        SUPERSCRIPT: {
            fontSize: '0.6em',
            verticalAlign: 'super',
        },
        SUBSCRIPT: {
            fontSize: '0.6em',
            verticalAlign: 'sub'
        },
        LINK: {
            textDecoration: 'underline',
        },
        CODE: {
            color: theme.palette.error.main,
            padding: '2px',
            backgroundColor: alpha(theme.palette.common[
            theme.palette.mode === 'light' ? 'black' : 'white'
            ], 0.04),
            border: `.5px solid ${theme.palette.divider}`,
            borderRadius: '5px',
        }
    }
}