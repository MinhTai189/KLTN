import { FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core'
import { FieldOption } from 'models'
import { ChangeEvent } from 'react'
import { useController, Control } from 'react-hook-form'

interface Props {
    label: string;
    options: FieldOption[];
    control: Control<any>;
    name: string;
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    margin?: 'dense' | 'normal' | 'none'

    [key: string]: any
}

const useStyles = makeStyles({
    root: {
        "& .MuiFormGroup-root": {
            flexDirection: 'row'
        },

        "& .MuiFormLabel-root": {
            marginBottom: 0,
        }
    }
})

export const RadioBtnField = ({ label, options, control, name, handleChange, margin = 'normal', ...props }: Props) => {
    const classes = useStyles()
    const { field: { value, onChange } } = useController({
        name,
        control
    })

    const onChangeRadio = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e)
        handleChange && handleChange(e)
    }

    return (
        <FormControl className={classes.root} component="fieldset" size="small" margin={margin}>
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup name={name} value={value} onChange={onChangeRadio} {...props}>
                {options.map((option, index) => (
                    <FormControlLabel key={index} checked={option.value === value} value={option.value} control={<Radio />} label={option.label} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}
