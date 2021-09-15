import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
    icon: ReactElement

    [key: string]: any
}

export const InputFieldIcon = ({ type, label, name, control, icon, ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error }, } = useController({
            name,
            control
        })

    return (
        <FormControl fullWidth variant="outlined" margin='normal'>
            <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
            <OutlinedInput
                fullWidth
                margin="none"
                id="outlined-adornment-amount"
                type={type}
                label={label}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                error={invalid}
                inputProps={props}
                startAdornment={icon}
                {...props}
            />
            <FormHelperText style={{ color: '#f44336' }}>{error}</FormHelperText>
        </FormControl>
    )
}
