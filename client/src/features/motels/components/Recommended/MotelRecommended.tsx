import { Card, CardActionArea, CardContent, CardMedia, makeStyles, Theme, Typography } from '@material-ui/core'
import { DateRange, LocationOn } from '@material-ui/icons'
import { Motel } from 'models'
import { Link } from 'react-router-dom'
import { calculateCreatedTimeDMY } from 'utils/convert-date/calculateCreatedTime'

interface Props {
    motelData: Motel
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        boxShadow: theme.shadows[3],

        '& .thumbnail': {
            width: '100%',
            height: 120,
            objectFit: 'cover',

            [theme.breakpoints.down('xs')]: {
                height: 130
            }
        },

        '& .content': {
            padding: theme.spacing(1),

            '& .name': {
                fontSize: '0.95em',
                marginBottom: 4,
                color: theme.palette.primary.main,
                fontWeight: 500
            },

            '& .list-info': {
                marginTop: 8,

                '& .rows': {
                    marginBottom: 12,

                    '& .info': {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: '0.8em',

                        '& > svg': {
                            width: '0.6em',
                            height: '0.6em',
                            marginRight: 8,
                        }
                    }
                }
            },
        },
    }
}))

export const MotelRecommended = ({ motelData }: Props) => {
    const classes = useStyles()

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <Link to={`/motels/${motelData._id}`}>
                    <CardMedia
                        className='thumbnail'
                        src={motelData.thumbnail as string}
                        alt='motel thumbnail'
                        component='img'
                    />

                    <CardContent className='content'>
                        <Typography
                            className='name'
                            variant='h5'
                        >
                            {motelData.name}
                        </Typography>

                        <ul className="list-info">
                            <li className="rows">
                                <Typography className='info'>
                                    <LocationOn />

                                    {motelData.address}
                                </Typography>
                            </li>

                            <li className="rows">
                                <Typography className='info'>
                                    <DateRange />

                                    {calculateCreatedTimeDMY(motelData.createdAt!)}
                                </Typography>
                            </li>
                        </ul>
                    </CardContent>
                </Link>
            </CardActionArea>
        </Card >
    )
}
