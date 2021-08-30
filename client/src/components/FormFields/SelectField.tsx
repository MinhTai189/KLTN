import { FormHelperText, makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { School } from 'models';
import { Control, useController } from 'react-hook-form';

interface Props {
    label: string;
    name: string;
    control: Control<any>;
    options: Array<School>;
    disabled: boolean;
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(3.3),
        marginBottom: theme.spacing(1.4),
    }
}))

export const SelectField = ({ label, name, control, options, disabled, ...props }: Props) => {
    const classes = useStyles()
    const { field: { value, onChange, onBlur, ref } } = useController({
        name,
        control
    })

    return (
        <FormControl className={classes.root} variant="outlined" fullWidth disabled={disabled}>
            <InputLabel>{label}</InputLabel>
            <Select
                labelId="demo-simple-select-outlined-label"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                label={label}
                inputProps={props}
            >
                {
                    options.map(option => (
                        <MenuItem key={option._id} value={option.codeName}>{option.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}
