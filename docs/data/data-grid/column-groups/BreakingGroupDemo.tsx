import * as React from 'react';
import {
  DataGridPro,
  GridColDef,
  GridColumnGroupingModel,
} from '@mui/x-data-grid-pro';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'isAdmin', type: 'boolean', headerName: 'is admin', width: 100 },
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true,
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true,
  },
];

const rows = [
  { id: 1, isAdmin: false, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, isAdmin: true, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, isAdmin: false, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, isAdmin: false, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, isAdmin: true, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, isAdmin: true, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, isAdmin: false, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, isAdmin: false, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, isAdmin: false, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: 'internal_data',
    headerName: 'Internal (not freeReordering)',
    description: '',
    children: [{ field: 'id' }, { field: 'isAdmin' }],
  },
  {
    groupId: 'naming',
    headerName: 'Names (freeReordering)',
    freeReordering: true,
    children: [{ field: 'lastName' }, { field: 'firstName' }],
  },
];
export default function BreakingGroupDemo() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        rows={rows}
        columns={columns}
        experimentalFeatures={{ columnGrouping: true }}
        checkboxSelection
        disableSelectionOnClick
        columnGroupingModel={columnGroupingModel}
      />
    </div>
  );
}
