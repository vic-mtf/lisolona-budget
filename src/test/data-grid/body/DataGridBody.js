import React, { useCallback, useMemo } from 'react';
import { Checkbox, TableBody, TableCell, TableRow } from '@mui/material';
import PropTypes from 'prop-types';
import TableCellInput from './TableCellInput';

export default function DataGridBody ({
    rows: _rows, 
    checkbox, 
    columns, 
    isSelectedRow,
    handleToggleSelectedRow,
}) {
    const rows = useMemo(() => 
        _rows?.map(row => {
            const row_ = {
                selected: isSelectedRow(row?.id),
                cells: [],
            };
            if(checkbox)
                row_.cells.push(
                    <Checkbox 
                        size="small"
                        checked={isSelectedRow(row?.id)}
                        onChange={() => handleToggleSelectedRow(row)}
                    />
                );
            columns.forEach(({field, ...otherProps}) => {
                row_.cells.push(row[field] !== undefined ? row[field]?.toString() : '');
                Object.keys(otherProps).forEach(key => { 
                    if(row_[key] === undefined)
                        row_[key] = otherProps[key];
                })
            });
            return row_;
        })
    , [_rows, columns, checkbox, isSelectedRow]);
   
    return (
        <React.Fragment>
            <TableBody>
            { rows?.map((row, _key) => (
                <TableRow key={_key} selected={row?.selected}>
                {row?.cells.map((value, key) => (
                    <React.Fragment key={key + _key}>
                        {typeof value === 'string' ? 
                        (<TableCellInput value={value} {...row}/>) :
                        (<TableCell 
                            height={100} 
                            variant="body"
                            padding="none"
                            align="center"
                        >
                            {value}
                        </TableCell>)
                        }
                    </React.Fragment>
                ))}
                </TableRow>
            ))}
            </TableBody>
        </React.Fragment>
    );
}

DataGridBody.defaultProps = {
    rows: [],
}

DataGridBody.propTypes = {
    rows: PropTypes.array,
}