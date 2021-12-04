import { Avatar, Chip, FormControl, FormHelperText, TextField, Theme, Tooltip, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { School } from 'models'
import { ChangeEvent, ComponentType, HTMLAttributes } from 'react'
import ListboxComponent from './ListboxComponent'


interface Props {
    value: (string | School)[]
    onChange: (e: ChangeEvent<{}>, value: (string | School)[]) => void
    loading: boolean
    listSchool: School[]
    err?: string
}

const useStyles = makeStyles((theme: Theme) => ({
    logo: {
        width: 20,
        height: 'auto',
        marginRight: 8,
        borderRadius: 0,

        [theme.breakpoints.down('xs')]: {
            width: 18,
        }
    },
    text: {
        fontSize: '0.8em',

        [theme.breakpoints.down('xs')]: {
            fontSize: '0.75em'
        }
    }
}))

export const AutoCompleteSchool = ({ value, onChange, loading, listSchool, err }: Props) => {
    const classes = useStyles()

    return (
        <FormControl fullWidth>
            <Autocomplete
                value={value}
                onChange={onChange}
                multiple
                id="tags-filled"
                freeSolo
                limitTags={3}
                loading={loading}
                options={listSchool}
                ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
                getOptionLabel={(option) => option.name}
                renderOption={(option: School) => (
                    <>
                        <Avatar
                            src={option.logo}
                            className={classes.logo}
                        >
                            U
                        </Avatar>

                        <Typography className={classes.text}>{option.name}</Typography>
                    </>
                )}
                renderTags={(value: School[], getTagProps) =>
                    value.map((option: School, index: number) => (
                        <Tooltip title={option.name}>
                            <Chip
                                color='secondary'
                                size='small'
                                avatar={<Avatar src={option.logo} />}
                                {...getTagProps({ index })}
                            />
                        </Tooltip>
                    ))
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        size='small'
                        placeholder="Nhập một trường học..."
                        variant='outlined'
                        color='secondary'
                    />
                )}
            />

            {err && <FormHelperText style={{ color: '#f44336' }}>{err}</FormHelperText>}
        </FormControl>
    )
}
