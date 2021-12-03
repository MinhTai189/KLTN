import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import Bell from 'assets/images/bell.png'

interface Props {
    isUnread?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        border: '2px solid #ccc',
        padding: theme.spacing(1),
        borderRadius: 10,
        marginBottom: theme.spacing(2.5),

        '& .left': {
            textAlign: 'center',
            marginRight: theme.spacing(1),

            '& .icon': {
                width: 55,
                height: 55,
            },

            '& .led-green': {
                marginTop: theme.spacing(1.3),
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
                fontSize: '0.95rem'
            },

            '& .bottom': {
                display: 'flex',
                alignItems: 'center',
                marginTop: theme.spacing(0.5),

                '& .date': {
                    fontSize: '1.05em',
                    flex: 1,
                    color: theme.palette.text.secondary
                },

                '& .type': {
                    fontSize: '0.65em',
                    background: '#edeef2',
                    padding: theme.spacing(0.2, 0.8),
                    borderRadius: 10
                }
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

export const NotificationItem = ({ isUnread }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Box className='left'>
                <img className='icon' src={Bell} alt="bell icon" />

                {isUnread && <span className="led-green"></span>}
            </Box>

            <Box className='body'>
                <Typography className='title' variant='h4'>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatum at nam repudiandae explicabo quam necessitatibus maxime consectetur iusto?
                </Typography>

                <Box className='bottom'>
                    <Typography
                        className='date'
                        component='small'
                    >
                        5:30 30/1/2012
                    </Typography>

                    <Typography
                        className='type'
                        component='span'
                    >
                        Chung
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
