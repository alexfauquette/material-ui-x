import * as React from 'react';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';
import { GridFilterInputValueProps } from './GridFilterInputValueProps';

export function GridFilterInputBoolean(props: GridFilterInputValueProps & TextFieldProps) {
  const { item, applyValue, apiRef, focusElementRef, components, componentsProps, ...others } =
    props;
  const [filterValueState, setFilterValueState] = React.useState(item.value || '');

  const TextField = React.useMemo(
    () => components?.BaseTextField || MUITextField,
    [components?.BaseTextField],
  );

  const onFilterChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      setFilterValueState(value);
      applyValue({ ...item, value });
    },
    [applyValue, item],
  );

  React.useEffect(() => {
    setFilterValueState(item.value || '');
  }, [item.value]);

  return (
    <TextField
      label={apiRef.current.getLocaleText('filterPanelInputLabel')}
      value={filterValueState}
      onChange={onFilterChange}
      variant="standard"
      select
      SelectProps={{
        native: true,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusElementRef}
      {...others}
      {...componentsProps?.baseTextField}
    >
      <option value="">{apiRef.current.getLocaleText('filterValueAny')}</option>
      <option value="true">{apiRef.current.getLocaleText('filterValueTrue')}</option>
      <option value="false">{apiRef.current.getLocaleText('filterValueFalse')}</option>
    </TextField>
  );
}
