import { keyBy, merge } from "lodash";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import _columns from "../views/main/displays/list/columns";

export default function useColumns () {
    const cols = useSelector(store => store?.data?.columns);
    const colums  = useMemo(() => {
        const _cols = merge(
            keyBy(_columns, 'field'),
            keyBy(cols, 'field')
        )
        return Object.keys(_cols).map(index => _cols[index]);
    }, [cols]);
    return colums;
}