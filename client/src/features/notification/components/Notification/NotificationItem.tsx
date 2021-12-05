import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useAppDispatch } from "app/hooks"
import { notifyActions } from "features/notification/notifySlice"
import { Notify } from "models"
import { useHistory } from "react-router"
import { calculateCreatedTimeHDMY } from "utils/convert-date/calculateCreatedTime"

interface Props {
    data: Notify
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        border: '2px solid #ccc',
        padding: theme.spacing(1),
        borderRadius: 10,
        marginBottom: theme.spacing(2.5),
        cursor: 'pointer',
        transition: '300ms',

        '&:hover': {
            background: '#ccc'
        },

        [theme.breakpoints.down('xs')]: {
            marginBottom: theme.spacing(1.5),
            padding: theme.spacing(0.5),
        },

        '& .left': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: theme.spacing(1),

            '& .icon': {
                width: 40,
                height: 40,

                [theme.breakpoints.down('xs')]: {
                    height: 38,
                    width: 38,
                }
            },

            '& .led-green': {
                marginTop: theme.spacing(0.5),
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: '#ABFF00',
                boxShadow: 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, #89FF00 0 2px 12px',
                animation: '$blink infinite 1s'
            },
        },

        '& .body': {
            '& .title': {
                fontSize: '0.95rem',

                [theme.breakpoints.down('xs')]: {
                    fontSize: '0.85rem'
                }
            },

            '& .bottom': {
                display: 'flex',
                alignItems: 'center',
                marginTop: theme.spacing(0.5),

                '& .date': {
                    fontSize: '1.05em',
                    flex: 1,
                    color: theme.palette.text.secondary,

                    [theme.breakpoints.down('xs')]: {
                        fontSize: '0.85em'
                    }
                },
            }
        }
    },
    '@keyframes blink': {
        'from': {
            background: '#ABFF00',
        },
        '50%': {
            background: '#7eb017',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #304701 0 -1px 9px, rgba(0, 255, 0, 0.5) 0 2px 0'
        },
        'to': {
            background: '#ABFF00',
        }
    }
}))

export const NotificationItem = ({ data }: Props) => {
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useAppDispatch()

    const handleReadAndNavigate = () => {
        data.url && history.push(data.url)
        dispatch(notifyActions.read(data._id))
    }

    return (
        <Box
            className={classes.root}
            onClick={handleReadAndNavigate}
        >
            <Box className='left'>
                <img className='icon' src={data.imageUrl} alt="bell icon" />

                {!data.read && <span className="led-green"></span>}
            </Box>

            <Box className='body'>
                <Typography className='title' variant='h4'>
                    {data.message}
                </Typography>

                <Box className='bottom'>
                    <Typography
                        className='date'
                        component='small'
                    >
                        {calculateCreatedTimeHDMY(data.createdAt)}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
