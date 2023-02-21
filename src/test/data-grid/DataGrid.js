import {
    Paper,
    Table,
    TableContainer, 
    TablePagination
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import DataGridHeader from './header/DataGridHeader';
import DataGridBody from './body/DataGridBody';
import { sortFuncDate, sortFuncString, sortNumber } from '../../utils/sortDate';

export default function DataGrid (props) {
    const {
        columns: _columns,
        rows,
        checkbox
    } = props;
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(100);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortByField, setSortByField] = useState('designation');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const columns = useMemo(() => _columns?.filter(col => !col?.pin), [_columns]);
    const pinningColumns = useMemo(() => _columns?.filter(col => col?.pin), [_columns]);

    const isSelectedRow = useCallback(
        rowId => !!selectedRows.find(({id}) => id === rowId), 
        [selectedRows]
    );

    const handleToggleSelectedRow = useCallback(
        row => {
            if(row) {
                const find = !!selectedRows.find(({id}) => id === row?.id);
                setSelectedRows(rows => find ? 
                    rows.filter(({id}) => id !== row?.id) :
                    [...rows, row]
                );
            } else setSelectedRows(_rows => _rows?.length ? [] : rows);
        }, 
        [selectedRows, rows, setSelectedRows]
    );
    const handleSort = field => () => {
        setSortOrder(field === sortByField && sortOrder === 'asc' ? 'desc' : 'asc');
        setSortByField(field);
      };
    const showPinnigTable = useMemo(() => pinningColumns?.length > 0 || checkbox, [pinningColumns, checkbox]);
    const count = useMemo(() => rows?.length, [rows]);
    const handleChangePage = (event, newPage) => setPage(newPage);

    const sortArray = useCallback((array) => {
        const field = sortByField;
        const { type } = columns.find(col => field === col?.field) || {};
        const  _array = array.map((data, index) => [index, data]);
        if(type === 'date') 
            _array.sort((a, b) => sortFuncDate(new Date(a[field]), new Date(b[field])));
        else if(type === 'number')
            _array.sort((a, b) => parseFloat(a[field]) - parseFloat(b[field]));
        else 
            _array.sort((a, b) => sortFuncString(a[field]?.toString(), b[field]?.toString()));
        if(sortOrder === 'desc') _array.reverse();
        return _array.map(field => field[1]);
    }, [columns, sortByField, sortOrder]);
   
    return (
        <Paper elevation={0}>
            <TablePagination
                rowsPerPageOptions={[]}
                component="div"
                variant="head"
                labelRowsPerPage="nome de page "
                labelDisplayedRows={({ from, to, count }) => 
                   `${from} à ${to} sur ${count !== -1 ? count : `plus que ${to}`}`
                }
                backIconButtonProps={{size: 'small'}}
                nextIconButtonProps={{size: 'small'}}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
            />
            <TableContainer
                sx={{
                    display: 'flex',
                    flex: 1,
                    height: 500,
                }}
            >
                {showPinnigTable &&
                <React.Fragment>
                    <Table
                        stickyHeader
                        sx={{
                            left: 0,
                            position: 'sticky',
                            zIndex: theme => theme.zIndex.appBar,
                            borderRight: theme => `1px solid ${theme.palette.divider}`,
                            bgcolor: theme => theme.palette.background.paper,
                        }}
                    >
                        <DataGridHeader 
                            columns={pinningColumns} 
                            checkbox={checkbox}
                            isSelectedRow={isSelectedRow}
                            handleToggleSelectedRow={handleToggleSelectedRow}
                            total={rows?.length}
                            rowsSelected={selectedRows?.length}
                            handleSort={handleSort}
                            sortOrder={sortOrder}
                            sortByField={sortByField}

                        />
                        <DataGridBody 
                            rows={rows} 
                            checkbox={checkbox} 
                            isSelectedRow={isSelectedRow}
                            handleToggleSelectedRow={handleToggleSelectedRow}
                            columns={pinningColumns}
                        />
                    </Table>
                </React.Fragment>}
                <Table stickyHeader>
                    <DataGridHeader 
                        columns={columns} 
                        handleSort={handleSort}
                        sortOrder={sortOrder}
                        sortByField={sortByField}
                    />
                    <DataGridBody 
                        rows={sortArray(rows)} 
                        columns={columns}
                        isSelectedRow={isSelectedRow}
                        handleToggleSelectedRow={handleToggleSelectedRow}
                    />
                </Table>
            </TableContainer>
        </Paper>
    );

}

DataGrid.defaultProps = {
    pinClomns: [],
    onChangeCell: null,
    checkbox: false,
    columns: [],
    rows: [],
}

DataGrid.propTypes = {
    pinClomns: propTypes.array,
    onChangeCell: propTypes.func,
    checkbox: propTypes.bool,
    columns: propTypes.array,
    rows: propTypes.array,
}
