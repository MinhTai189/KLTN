import { FormHelperText, makeStyles, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

interface Props {
    options: Array<any>;
    onChange: (e: any, value: any) => void;
    label: string;
    disabled: boolean;
    title: string;
    value?: any;
    error?: string
    size?: 'medium' | 'small'

    [key: string]: any
}

export const AutoCompleteField = ({ options, onChange, label, disabled = false, title, value, error, size = 'medium', ...props }: Props) => {
    const useStyles = makeStyles(theme => ({
        root: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(1),

            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: error ? '#f44336' : 'rgba(0, 0, 0, 0.23)',
            },

            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: error ? '#f44336 !important' : 'rgba(0, 0, 0, 0.23)',
            },

            "& .MuiFormLabel-root.Mui-focused": {
                color: error ? '#f44336' : ''
            }
        }
    }))
    const classes = useStyles()

    return (
        <>
            <Autocomplete
                className={classes.root}
                size={size}
                value={value}
                options={options}
                getOptionLabel={(option) => option[title]}
                fullWidth
                disabled={disabled}
                onChange={onChange}
                renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
                {...props}
            />
            {error && error.length > 0 && <FormHelperText style={{ color: '#f44336', marginLeft: 16 }} id="component-error-text">{error}</FormHelperText>}
        </>
    )
}
