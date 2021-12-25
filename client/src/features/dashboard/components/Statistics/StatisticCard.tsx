import { Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"

interface Props {
    icon: any
    label: string
    quantity: number
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        height: 120,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: theme.shadows[3],
        padding: theme.spacing(1, 2),
        borderRadius: 5,

        '& .icon': {
            width: '4.5rem',
            height: '4.5rem',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: theme.palette.primary.main,
            marginRight: theme.spacing(2.5),

            '& > svg': {
                fill: '#fff',
                width: '2em',
                height: '2em',
            }
        },

        '& .detail': {
            '& .quantity': {
                fontSize: '1.85rem',
                fontWeight: 600
            },

            '& .text': {
                color: theme.palette.text.secondary,
                textTransform: 'lowercase'
            }
        }
    }
}))

const StatisticCard = ({ icon, label, quantity }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <span className="icon">
                {icon}
            </span>

            <span className="detail">
                <Typography className='quantity' variant='h4'>
                    {quantity}
                </Typography>

                <Typography className='text'>
                    {label}
                </Typography>
            </span>
        </Box>
    )
}

export default StatisticCard
