import { Box, FormControl, FormHelperText, TextField, Theme, Typography } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { Motel } from 'models'
import { ChangeEvent, ComponentType, HTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import ListboxComponent from '../ListboxComponent'
import { MotelRowOption } from './MotelRowOption'

interface Props {
    value: Motel | undefined
    onChange: (e: ChangeEvent<{}>, value: Motel | null) => void
    listMotel: Motel[]
    errMotel?: string
    loading?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    noOption: {
        textAlign: 'center',

        '& .title': {
            fontSize: '1.1em',
        },

        '& .text': {
            fontSize: '0.9em',
            color: theme.palette.text.secondary
        },

        '& .add-icon': {
            fill: theme.palette.primary.main,
            width: '2em',
            height: '2em',
            marginTop: theme.spacing(1),
            cursor: 'pointer',
            transition: '300ms',

            '&:hover': {
                fill: theme.palette.primary.dark
            }
        }
    }
}))

export const AutocompleteMotel = ({ listMotel, errMotel, value, onChange, loading }: Props) => {
    const classes = useStyles()

    const NoOption = (
        <Box className={classes.noOption}>
            <Typography
                variant='h6'
                className='title'
            >
                Nhà trọ mà bạn cần tìm hiện không có dữ liệu
            </Typography>

            <Typography className='text'>
                Hãy thêm dữ liệu nhà trọ trước khi đăng tin
            </Typography>

            <Link to='/add-motel'>
                <AddCircle
                    className='add-icon'
                />
            </Link>
        </Box>
    )

    return (
        <FormControl fullWidth>
            <Autocomplete
                value={value}
                onChange={onChange}
                loading={loading}
                options={listMotel}
                getOptionLabel={(option) => option.name}
                renderOption={(option) => (
                    <MotelRowOption motel={option} />
                )}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        variant="outlined"
                        size='small'
                    />}
                noOptionsText={NoOption}
                ListboxComponent={ListboxComponent as ComponentType<HTMLAttributes<HTMLElement>>}
            />

            {errMotel && <FormHelperText style={{ color: '#f44336' }}>{errMotel}</FormHelperText>}
        </FormControl>
    )
}
