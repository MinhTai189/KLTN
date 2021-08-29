import { FormHelperText } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import React from 'react';
import { Control, useController } from 'react-hook-form';

interface Props {
    label: string;
    name: string;
    control: Control<any>
}

export const SelectField = ({ label, name, control, ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref }, fieldState: { invalid, error } } = useController({
        name,
        control
    })

    return (
        <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                error={invalid}
                label={label}
                inputProps={props}
            >
                <MenuItem value={10}>Thành phố Mỹ Tho</MenuItem>
                <MenuItem value={20}>Châu Thành</MenuItem>
                <MenuItem value={30}>Bến Tre</MenuItem>
            </Select>
            <FormHelperText id="component-error-text">{error?.message}</FormHelperText>
        </FormControl>
    )
}
