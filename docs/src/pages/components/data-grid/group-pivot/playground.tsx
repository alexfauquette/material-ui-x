import * as React from 'react';
import { DataGridPro, useGridApiRef, GridEvents } from '@mui/x-data-grid-pro';
import { topMovies } from './data'




const useKeepGroupingColumnsHidden = (apiRef, columns, initialModel, leafField, columnsToKeep) => {
  const prevModel = React.useRef(initialModel);

  React.useEffect(() => {
    apiRef.current.subscribeEvent(GridEvents.rowGroupingModelChange, (newModel) => {
      apiRef.current.updateColumns([
        ...newModel
          .filter((field) => !prevModel.current.includes(field) && !columnsToKeep.includes(field))
          .map((field) => ({ field, hide: true })),
        ...prevModel.current
          .filter((field) => !newModel.includes(field) && !columnsToKeep.includes(field))
          .map((field) => ({ field, hide: false })),
      ]);

      prevModel.current = initialModel;
    });
  }, [apiRef, initialModel]);

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
  maximumFractionDigits: 0
});

const columns = [
  { field: "Title", width: 250, groupable: false },
  // { field: "Year" },
  {
    field: "Runtime",
    valueFormatter: ({ value, id }) => {
      console.log({ value, id })
      if (id.slice(0, "auto-generated-row".length) === "auto-generated-row") {
        return null
      }
      const hours = Math.floor(value / 60); const minutes = value % 60; return `${hours}:${minutes}`
    },
    width: 100
  },
  {
    field: "Released",
    width: 150,
    type: "date",
    // valueFormatter: ({ value, id }) => {
    //   console.log({ value, id })
    //   if (id.slice(0, "auto-generated-row".length) === "auto-generated-row") {
    //     return ""
    //   }
    //   return new Date(value)
    // },
    valueGetter: ({ value, row: { Released: valueToUse } }) => {
      // console.log({ value, valueToUse });
      // console.log(new Date(value))
      return new Date(valueToUse)
    },
    keyGetter: ({ value }) => {
      return `${Math.floor(value.getFullYear() / 10)}0's`
      // return value.toISOString().split('T')[0]
    }
  },
  { field: "Director", width: 200 },
  // { field: "Language" },
  { field: "Country", width: 150 },
  { field: "imdbRating", headerName: "IMBd", width: 80 },
  {
    field: "BoxOffice",
    valueFormatter: ({ value, id }) => {
      if (id.slice(0, "auto-generated-row".length) === "auto-generated-row") {
        return null
      }
      return value ? currencyFormatter.format(value) : "N/A"
    },
    keyGetter: ({ value }) => {
      if (!value) {
        return "N/A"
      }
      const digitNumber = Math.floor(value).toString().length;

      return `>${currencyFormatter.format(10 ** (digitNumber - 1))}`
    },
    width: 150
  },
]

export default function CustomFilterPanel() {


  const apiRef = useGridApiRef();
  const cleanedColumns = useKeepGroupingColumnsHidden(
    apiRef,
    columns,
    [],
    false,
    ["BoxOffice"]
  );


  return (
    <div style={{ height: 500, width: 1000 }}>
      <DataGridPro
        apiRef={apiRef}
        columns={cleanedColumns}
        rows={topMovies}
        experimentalFeatures={{ rowGrouping: true }}
        hideFooter
      />
    </div>
  );
}
