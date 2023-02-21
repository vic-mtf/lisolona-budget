import React from 'react';
import {
    Box,
    TableCell,
    TableHead, 
    TableRow, 
    TableSortLabel,
    Checkbox
} from '@mui/material';
import Typography from '../../../components/Typography';

export default function DataGridHeader ({
    columns, 
    checkbox,
    handleToggleSelectedRow,
    total,
    rowsSelected,
    handleSort,
    sortOrder,
    sortByField
}) {

    return (
        <React.Fragment>
            <TableHead
                sx={{height: 80}}
            >
                <TableRow >
                    {checkbox &&
                    <TableCell>
                        <Checkbox 
                            size="small" 
                            indeterminate={rowsSelected > 0 && total > rowsSelected}
                            checked={rowsSelected > 0}
                            onChange={() => handleToggleSelectedRow()}
                        />
                    </TableCell>}
                    {columns?.map(({
                        id, 
                        label, 
                        sortable, 
                        field,
                        ...column
                    }) => (
                    <React.Fragment key={id}>
                        <TableCell variant="head">
                            <Box
                                component={(sortable === undefined || sortable) ? TableSortLabel : 'div'}
                                onClick={handleSort(field)}
                                title={`${label}\n${column.description || ''}`}
                                active={sortByField === field}
                                direction={(sortByField === field) ? sortOrder : 'asc'}
                            >
                                <Typography
                                    whiteSpace="nowrap"
                                    textOverflow="ellipsis"
                                    maxWidth={120}
                                    overflow="hidden"
                                    flexGrow={1}
                                    fontSize={15}
                                    fontWeight="bold"
                                >{label}</Typography>
                            </Box>
                        </TableCell>
                    </React.Fragment>
                    ))}
                </TableRow>
            </TableHead>
        </React.Fragment>
    )
}