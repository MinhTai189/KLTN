import { FormControl, FormControlLabel, FormLabel, makeStyles, Radio, RadioGroup } from '@material-ui/core'
import { RadioOption } from 'models'
import { useController, Control } from 'react-hook-form'

interface Props {
    label: string;
    options: RadioOption[];
    control: Control<any>;
    name: string
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

export const RadioBtnField = ({ label, options, control, name, ...props }: Props) => {
    const classes = useStyles()
    const { field: { value, onChange } } = useController({
        name,
        control
    })

    return (
        <FormControl className={classes.root} component="fieldset" size="small" margin="normal">
            <FormLabel component="legend">{label}</FormLabel>
            <RadioGroup aria-label="gender" name={name} value={value} onChange={onChange} {...props}>
                {options.map((option, index) => (
                    <FormControlLabel key={index} checked={option.value === value} value={option.value} control={<Radio />} label={option.label} />
                ))}
            </RadioGroup>
        </FormControl>
    )
}
