import { TextField } from '@material-ui/core'
import React, { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
}



export const InputField = ({ type, label, name, control, ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error }, } = useController({
            name,
            control
        })

    return (
        <TextField
            fullWidth
            margin="normal"
            id="outlined-search"
            label={label}
            type={type}
            variant="outlined"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            error={invalid}
            helperText={error?.message}
            inputProps={props} />
    )
}
