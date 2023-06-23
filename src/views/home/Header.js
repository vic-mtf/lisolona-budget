import { Toolbar } from '@mui/material'
import Title from './Title';
export default function Header () {
    return (
        <Toolbar
            sx={{
                height:'auto',
                position:'relative',
            }}
            variant="dense"
        >
            <Title/>
        </Toolbar>
    )
}

export function comparePathnames(pathname1, pathname2) {
    const trimmedPathname1 = pathname1.replace(/^\/+|\/+$/g, "");
    const trimmedPathname2 = pathname2.replace(/^\/+|\/+$/g, "");
    return trimmedPathname1.toLowerCase() === trimmedPathname2.toLowerCase();
}