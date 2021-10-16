import { TextField } from '@material-ui/core'
import { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
    multiline?: boolean;
    rows?: number;
    sizeField?: "medium" | "small" | undefined;
    margin?: 'dense' | 'none' | 'normal';
    [key: string]: any
}



export const InputField = ({ type, label, name, control, multiline = false, rows, sizeField = 'medium', margin = 'normal', ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error }, } = useController({
            name,
            control
        })

    return (
        <TextField
            fullWidth
            margin={margin}
            label={label}
            type={type}
            variant="outlined"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            inputRef={ref}
            error={invalid}
            helperText={error?.message}
            inputProps={props}
            multiline={multiline}
            rows={rows}
            size={sizeField}
        />
    )
}
