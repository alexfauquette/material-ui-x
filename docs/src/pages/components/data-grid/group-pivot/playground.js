import * as React from 'react';
import { DataGridPro, useGridApiRef, GridEvents } from '@mui/x-data-grid-pro';
import { topMovies } from './data';

const useKeepGroupingColumnsHidden = (
  apiRef,
  columns,
  initialModel,
  leafField,
  columnsToKeep,
) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      apiRef.current.updateColumns([
        ...newModel
          .filter(
            (field) =>
              !prevModel.current.includes(field) && !columnsToKeep.includes(field),
          )
          .map((field) => ({ field, hide: true })),
        ...prevModel.current
          .filter(
            (field) => !newModel.includes(field) && !columnsToKeep.includes(field),
          )
          .map((field) => ({ field, hide: false })),
      ]);

      prevModel.current = initialModel;
    });
  }, [apiRef, columnsToKeep, initialModel]);

  return React.useMemo(
    () =>
      columns.map((colDef) =>
        initialModel.includes(colDef.field) ||
        (leafField && colDef.field === leafField)
          ? { ...colDef, hide: true }
          : colDef,
      ),
    [columns, initialModel, leafField],
  );
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const columns = [
  { field: 'Title', width: 200, groupable: true },
  // { field: "Year" },
  { field: 'imdbRating', headerName: 'IMBd', width: 80 },
  {
    field: 'Runtime',
    valueFormatter: ({ value, id }) => {
      if (id.slice(0, 'auto-generated-row'.length) === 'auto-generated-row') {
        return null;
      }
      const hours = Math.floor(value / 60);
      const minutes = value % 60;
      return `${hours}:${minutes}`;
    },
    width: 100,
  },
  {
    field: 'Released',
    width: 100,
    type: 'date',
    valueFormatter: ({ value, id }) => {
      if (id.slice(0, 'auto-generated-row'.length) === 'auto-generated-row') {
        return '';
      }
      const date = new Date(value);
      return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;
    },
    valueGetter: ({ value, row: { Released: valueToUse } }) => {
      return new Date(valueToUse);
    },
    keyGetter: ({ value }) => {
      return `${Math.floor(value.getFullYear() / 10)}0's`;
      // return value.toISOString().split('T')[0]
    },
  },
  // { field: "Language" },
  {
    field: 'BoxOffice',
    valueFormatter: ({ value, id }) => {
      if (id.slice(0, 'auto-generated-row'.length) === 'auto-generated-row') {
        return null;
      }
      return value ? currencyFormatter.format(value) : 'N/A';
    },
    keyGetter: ({ value }) => {
      if (!value) {
        return 'N/A';
      }
      const digitNumber = Math.floor(value).toString().length;

      // return `>${currencyFormatter.format(10 ** (digitNumber - 1))}`;
      return 10 ** (digitNumber - 1);
    },
    // sortComparator: (a, b) => {
    //   console.log({ a, b });
    //   if (a === b) {
    //     return 0;
    //   }
    //   if (a === 'N/A') {
    //     return -1;
    //   }
    //   if (b === 'N/A') {
    //     return 1;
    //   }
    //   return a.length > b.length ? 1 : -1;
    // },
    width: 150,
  },
  { field: 'Director', width: 200 },
  { field: 'Country', width: 150 },
];

export default function CustomFilterPanel() {
  const apiRef = useGridApiRef();
  // const cleanedColumns = useKeepGroupingColumnsHidden(apiRef, columns, [], false, [
  //   'BoxOffice',
  // ]);

  return (
    <div style={{ height: 500, width: 1000 }}>
      <DataGridPro
        apiRef={apiRef}
        columns={columns}
        rows={topMovies}
        experimentalFeatures={{ rowGrouping: true }}
        hideFooter
        initialState={{
          rowGrouping: {
            model: ['Director', 'BoxOffice'],
          },
        }}
        groupingColDef={{
          mainGroupingCriteria: 'BoxOffice',
          headerName: 'Group',
        }}
      />
    </div>
  );
}
