import { FormControl, FormHelperText, InputLabel, OutlinedInput, PropTypes } from '@material-ui/core'
import { ReactElement } from 'react'
import { Control, useController } from 'react-hook-form'

interface Props {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
    icon: ReactElement;
    marginOut?: PropTypes.Margin | undefined
    marginIn?: 'dense' | 'none'
    [key: string]: any
}

export const InputFieldIcon = ({ type, label, name, control, icon, marginOut = 'normal', marginIn = 'none', ...props }: Props) => {
    const { field: { value, onChange, onBlur, ref },
        fieldState: { invalid, error }, } = useController({
            name,
            control
        })

    return (
        <FormControl fullWidth variant="outlined" margin={marginOut}>
            <InputLabel htmlFor="outlined-adornment-amount">{label}</InputLabel>
            <OutlinedInput
                fullWidth
                margin={marginIn}
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
