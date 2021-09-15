import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { FieldOption } from 'models';
import { Control, useController } from 'react-hook-form';

interface Props {
    label: string;
    name: string;
    control: Control<any>;
    options: Array<FieldOption>;
    disabled: boolean;
    defaultValue?: any;
    mt: number;
    mb: number;
    [key: string]: any
}

export const SelectField = ({ label, name, control, options, disabled, defaultValue, mb, mt, ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref }, fieldState: { invalid, error } } = useController({
        name,
        control
    })

    return (
        <FormControl style={{ marginTop: mt, marginBottom: mb }} variant="outlined" fullWidth disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                label={label}
                inputProps={props}
                error={invalid}
                defaultValue={defaultValue}
                {...props}
            >
                {
                    options.map((option, index) => (
                        <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                    ))
                }
            </Select>
            <FormHelperText style={{ color: '#f44336' }} id="component-error-text">{error?.message}</FormHelperText>
        </FormControl>
    )
}
