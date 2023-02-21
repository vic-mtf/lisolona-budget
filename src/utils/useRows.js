import { useMemo } from "react";

export default function useRows (data) {
    const rows = useMemo(() => 
        data.map((item, index) => ({
            ...item,
            id: index + 1,
            createdAt: new Date(item.createdAt),
            classNum: '---------',
            code: '---------',
            destination: '---------',
            urgence: '---------',
            refNum: '---------',
            numServiceDis: '---------',
            origin: item.createdBy.role,
            type: item.type?.type,
            designation: item?.designation,
            object: item?.object,
            description: item?.description,
            secrete: '---------',
            status: '---------',
            subType: item.type?.subType || '---------',
        })),[data]);

    return rows;
}