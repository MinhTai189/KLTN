import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { DropdownList } from 'models'

interface Props {
    option: DropdownList
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        padding: 8,
        transition: theme.transitions.easing.sharp,
        cursor: 'pointer',
        width: '100%',

        "&:not(:last-child)": {
            borderBottom: '1px solid #ccc',
        },

        "&.align-center": {
            alignItems: 'center'
        }
    },
    left: {
        color: theme.palette.text.secondary,
        width: '100%',
        display: 'flex',
        alignItems: 'center',

        '& .logo': {
            width: 25,
            height: 25,
            marginRight: theme.spacing(1),

            [theme.breakpoints.down('xs')]: {
                width: 18,
                height: 18,
            },
        },

        "& p": {
            fontWeight: 500,

            [theme.breakpoints.down('xs')]: {
                fontSize: '0.85rem'
            },
        }
    },
    amount: {
        fontSize: '0.8em',
        whiteSpace: 'nowrap'
    }
}))

export const DropdownRows = ({ option }: Props) => {
    const classes = useStyles()

    const { name, logo, motels } = option

    return (
        <Box className={classes.root}>
            <Box className={classes.left}>
                <img className='logo' src={logo} alt="school logo" />

                <Typography>
                    {name}
                </Typography>
            </Box>

            <Typography className={classes.amount}>
                {`${motels.length} nhà trọ`}
            </Typography>
        </Box>
    )
}
