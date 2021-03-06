import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'

interface Props {
    name: string;
    label: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    margin?: 'normal' | 'dense' | 'none'
    [key: string]: any
}

const useStyles = makeStyles({
    root: {
        "& .MuiInputLabel-outlined": {
            transform: 'translate(14px,-6px) scale(0.75)',
            background: '#fff',
        }
    }
})

export const FileInputField = ({ name, label, onChange, error, margin = 'normal', ...props }: Props) => {
    const classes = useStyles()

    return (<TextField
        className={classes.root}
        type="file"
        fullWidth
        margin={margin}
        variant="outlined"
        name={name}
        label={label}
        onChange={onChange}
        inputProps={props}
        error={!!error}
        helperText={error}
    />
    )
}
