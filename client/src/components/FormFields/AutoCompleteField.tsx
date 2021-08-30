import { makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

interface Props {
    options: Array<any>;
    onChange: (e: any, value: any) => void;
    label: string;
    disabled: boolean;
    title: string;
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2)
    }
}))

export const AutoCompleteField = ({ options, onChange, label, disabled = false, title, ...props }: Props) => {
    const classes = useStyles()

    return (
        <Autocomplete
            className={classes.root}
            id="combo-box-demo"
            options={options}
            getOptionLabel={(option) => option[title]}
            fullWidth
            disabled={disabled}
            onChange={onChange}
            renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
            {...props}
        />
    )
}
