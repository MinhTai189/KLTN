import { makeStyles, TextField } from '@material-ui/core'
import React, { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
}

const useStyles = makeStyles({
    root: {
        "& .MuiInputLabel-outlined": {
            transform: 'translate(14px,-6px) scale(0.75)',
            background: '#fff',
        }
    }
})

export const InputField = ({ type, label, name, control, ...props }: Props) => {
    const classes = useStyles()
    const { field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error }, } = useController({
            name,
            control
        })

    return (
        <TextField
            className={type === 'file' ? classes.root : ''}
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
