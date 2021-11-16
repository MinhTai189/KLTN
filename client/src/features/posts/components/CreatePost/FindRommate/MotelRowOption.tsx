import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Motel, School } from 'models'

interface Props {
    motel: Motel
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '& > .thumbnail': {
            width: 90,
            height: 60,
            objectFit: 'cover',
            marginRight: theme.spacing(1)
        },

        '& > .info-wrapper': {
            '& .motel': {
                fontSize: '0.9em',
            },

            '& .addr': {
                fontSize: '0.75em',
                color: theme.palette.text.secondary
            },

            '& .list-scholl': {
                display: 'flex',
                alignItems: 'center',

                '& .school': {
                    marginRight: theme.spacing(2),

                    '& > img': {
                        width: 'auto',
                        height: 15,
                        objectFit: 'cover',
                    }
                }
            }
        }
    }
}))

export const MotelRowOption = ({ motel }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <img
                className='thumbnail'
                src={motel.thumbnail as string}
                alt="motel thumbnail"
            />

            <Box className='info-wrapper'>
                <Typography
                    className='motel'
                    variant='h6'
                >
                    {motel.name}
                </Typography>

                <Typography className='addr'>
                    {motel.address}
                </Typography>

                <ul className="list-scholl">
                    {motel.school.map((school: School) => (
                        <li
                            className="school"
                            key={school._id}
                        >
                            <img src={school.logo} alt="school logo" />
                        </li>
                    ))}
                </ul>
            </Box>
        </Box>
    )
}
