import { Box, TextField, Theme, Typography, Chip } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import ListboxComponent from '../ListboxComponent'
import { ComponentType, HTMLAttributes } from 'react'
import { MotelRowOption } from './MotelRowOption'
import { Motel } from 'models'

interface Props {
    listMotel: Motel[]
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

export const AutocompleteMotel = ({ listMotel }: Props) => {
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

            <AddCircle className='add-icon' />
        </Box>
    )

    return (
        <Autocomplete
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
    )
}
