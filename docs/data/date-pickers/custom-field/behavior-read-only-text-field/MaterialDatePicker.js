import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useValidation, validateDate } from '@mui/x-date-pickers/validation';
import {
  useSplitFieldProps,
  useParsedFormat,
  usePickerContext,
} from '@mui/x-date-pickers/hooks';
import { CalendarIcon } from '@mui/x-date-pickers/icons';

function ReadOnlyDateField(props) {
  const { internalProps, forwardedProps } = useSplitFieldProps(props, 'date');
  const { value, timezone, format } = internalProps;
  const { InputProps, slotProps, slots, ...other } = forwardedProps;

  const pickerContext = usePickerContext();

  const parsedFormat = useParsedFormat(internalProps);
  const { hasValidationError } = useValidation({
    validator: validateDate,
    value,
    timezone,
    props: internalProps,
  });

  const handleTogglePicker = (event) => {
    if (pickerContext.open) {
      pickerContext.onClose(event);
    } else {
      pickerContext.onOpen(event);
    }
  };

  return (
    <TextField
      {...other}
      value={value == null ? '' : value.format(format)}
      placeholder={parsedFormat}
      InputProps={{
        ...InputProps,
        readOnly: true,
        endAdornment: <CalendarIcon color="action" />,
        sx: { cursor: 'pointer', '& *': { cursor: 'inherit' } },
      }}
      error={hasValidationError}
      onClick={handleTogglePicker}
    />
  );
}

function ReadOnlyFieldDatePicker(props) {
  return (
    <DatePicker {...props} slots={{ ...props.slots, field: ReadOnlyDateField }} />
  );
}

export default function MaterialDatePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ReadOnlyFieldDatePicker />
    </LocalizationProvider>
  );
}
