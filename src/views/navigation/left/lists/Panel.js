import { useLiveQuery } from "dexie-react-hooks";
import Button from '@mui/material/Button'
import db from "../../../../database/db";

export default function Panel ({value, index, children, name, search}) {
    const data = useLiveQuery(() => db[name] )
    return value === index && children;
}