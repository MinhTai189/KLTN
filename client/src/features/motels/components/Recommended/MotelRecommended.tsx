import { Box, Card, CardActionArea, CardContent, CardMedia, makeStyles, Theme, Typography, Divider } from '@material-ui/core'
import { DateRange, LocationOn } from '@material-ui/icons'
import { ChipCustom } from 'components/Common'
import { styleChips } from 'utils'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 220,

        '& .thumbnail': {
            width: '100%',
            height: 150,
            objectFit: 'cover'
        },

        '& .content': {
            padding: theme.spacing(1),

            '& .name': {
                fontSize: '1em',
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
                        fontSize: '0.7em',

                        '& > svg': {
                            width: '0.55em',
                            height: '0.55em',
                            marginRight: 4,
                        }
                    }
                }
            },

            '& .chips': {
                display: 'flex',
                justifyContent: 'space-between'
            }
        },
    }
}))

export const MotelRecommended = (props: Props) => {
    const classes = useStyles()

    return (
        <Card className={classes.root}>
            <CardActionArea>
                <CardMedia
                    className='thumbnail'
                    src='http://res.cloudinary.com/dpregsdt9/image/upload/v1634395444/6162b4dd19bac15892bfb7d1/arapmj5xfkhace340uc5.jpg'
                    alt='motel thumbnail'
                    component='img'
                />

                <CardContent className='content'>
                    <Typography
                        className='name'
                        variant='h5'
                    >
                        Nhà trọ Minh Tài
                    </Typography>

                    <ul className="list-info">
                        <li className="rows">
                            <Typography className='info'>
                                <LocationOn />

                                123/4 Ấp Bắc, Mỹ Tho, Tiền Giang
                            </Typography>
                        </li>

                        <li className="rows">
                            <Typography className='info'>
                                <DateRange />

                                20/10/2021
                            </Typography>
                        </li>
                    </ul>

                    <Divider style={{ marginBottom: 4, }} />

                    <ul className='chips'>
                        <li className='chip'>
                            <ChipCustom
                                style={styleChips.green}
                                label={'Còn phòng'}
                                size='small'
                                color='primary'
                            />
                        </li>

                        <li className='chip'>
                            <ChipCustom
                                style={styleChips.blue}
                                label='500k-800k/tháng'
                                size='small'
                                color='primary'
                            />
                        </li>
                    </ul>
                </CardContent>
            </CardActionArea>
        </Card >
    )
}
