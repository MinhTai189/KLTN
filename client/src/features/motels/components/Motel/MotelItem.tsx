import { Card, CardActionArea, CardContent, CardMedia, Theme, Typography, Divider, Box } from '@material-ui/core'
import { DateRange, LocalActivity, LocationOn } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { ChipCustom } from 'components/Common'
import { Motel } from 'models'
import { memo } from 'react'
import { useHistory } from 'react-router'
import { getColorChip, styleChips } from 'utils'
import { mapPriceMonth } from 'utils/getPriceMotel'

interface Props {
    listLayout: 'list' | 'grid'
    dataMotel: Motel
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        maxWidth: 750,
        height: 225,

        '&.grid': {
            height: 450,
        }
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',

        '&.grid': {
            flexDirection: 'column',
        }
    },
    thumbnail: {
        width: '35%',

        '&.grid': {
            width: '100%',
            height: 200
        },

        '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
    },
    infor: {
        flex: 1,

        '&.grid': {
            height: 250,
            padding: theme.spacing(1.5)
        },

        '& .name': {
            fontSize: '1.4em',
            fontWeight: 400
        },

        '& .list-chip': {
            display: 'flex',
            marginBottom: 4,

            '& .chip': {
                marginBottom: 4,

                '&:not(:last-child)': {
                    marginRight: 4
                }
            }
        },

        '& .list-infor': {
            marginBottom: 4,

            '& .items': {
                display: 'flex',
                alignItems: 'center',

                "&:not(:last-child)": {
                    marginBottom: 4,
                },

                '& .icon': {
                    marginRight: 6,
                    width: '0.75em',
                    height: '0.75em',
                    fill: theme.palette.primary.dark
                },

                '& .text': {
                    fontSize: '0.85em',
                    color: '#555'
                },
            }
        },

        '& .desc': {
            fontSize: '0.8em',
            marginTop: 4,
            color: '#6d6d6d'
        }
    }
}))

const MotelCard = ({ listLayout, dataMotel }: Props) => {
    const classes = useStyles()
    const history = useHistory()

    const { _id, thumbnail, name, status, room, mark, address, createdAt, desc } = dataMotel

    const createdDate = new Date(createdAt || '')
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    let splitedDesc = ''

    if (listLayout === 'grid') {
        splitedDesc = desc.length > 280 ? desc.slice(0, 280) + '...' : desc.slice(0, 280)
    } else {
        splitedDesc = desc.length > 360 ? desc.slice(0, 280) + '...' : desc.slice(0, 280)
    }

    const handleClickItem = () => {
        history.push(`/motels/${_id}`)
    }

    return (
        <Card className={`${classes.root} ${listLayout === 'grid' ? 'grid' : ''}`}>
            <CardActionArea onClick={handleClickItem}>
                <Box className={`${classes.wrapper} ${listLayout === 'grid' ? 'grid' : ''}`}>
                    <CardMedia
                        className={`${classes.thumbnail} ${listLayout === 'grid' ? 'grid' : ''}`}
                        src={thumbnail as string}
                        component='img'
                    />

                    <CardContent className={`${classes.infor} ${listLayout === 'grid' ? 'grid' : ''}`}>
                        <Typography className='name' variant='h2'>{name}</Typography>

                        <ul className="list-chip">
                            <li className='chip'>
                                <ChipCustom
                                    style={status ? styleChips.green : styleChips.red}
                                    label={status ? 'Còn phòng' : 'Hết phòng'}
                                    size='small'
                                    color='primary'
                                />
                            </li>

                            {room.map(item => {
                                const color = getColorChip()
                                const label = mapPriceMonth(item.price) + '/tháng'

                                return (
                                    <li key={item._id} className='chip'>
                                        <ChipCustom
                                            // @ts-ignore
                                            style={styleChips[color]}
                                            label={label}
                                            size='small'
                                            color='primary'
                                        />
                                    </li>
                                )
                            })}
                        </ul>

                        <ul className='list-infor'>
                            <li className="items">
                                <LocalActivity className='icon' />

                                <Typography className='text'>
                                    {mark?.toFixed(2)}
                                </Typography>
                            </li>

                            <li className="items">
                                <LocationOn className='icon' />

                                <Typography className='text'>
                                    {address}
                                </Typography>
                            </li>

                            <li className="items">
                                <DateRange className='icon' />

                                <Typography className='text'>
                                    {date}
                                </Typography>
                            </li>
                        </ul>

                        <Divider />

                        <Typography className='desc'>
                            {splitedDesc}
                        </Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
        </Card>
    )
}

export const MotelItem = memo(MotelCard)
