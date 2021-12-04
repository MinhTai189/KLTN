import { Card, CardActionArea, CardContent, CardMedia, Theme, Typography, Divider, Box, Tooltip, Avatar } from '@material-ui/core'
import { DateRange, LocalActivity, LocationOn } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { ChipCustom } from 'components/Common'
import { Motel, School } from 'models'
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
            minHeight: 450,

            [theme.breakpoints.down('xs')]: {
                minHeight: 420
            },
        }
    },
    wrapper: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',

        '&.grid': {
            flexDirection: 'column',
        }
    },
    thumbnail: {
        width: '35%',

        '&.grid': {
            width: '100%',
            height: 200,

            [theme.breakpoints.down('sm')]: {
                height: 175
            },

            [theme.breakpoints.down('xs')]: {
                height: 160
            },
        },

        '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
        }
    },
    infor: {
        flex: 1,

        [theme.breakpoints.down('md')]: {
            padding: theme.spacing(1, 1.5),
        },

        '&.grid': {
            height: 250,
            padding: theme.spacing(1.5)
        },

        '& .name': {
            fontSize: '1.4em',
            fontWeight: 400,

            [theme.breakpoints.down('md')]: {
                fontSize: '1.35em',
            },

            [theme.breakpoints.down('sm')]: {
                fontSize: '1.3em'
            }
        },

        '& .list-chip': {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 4,

            '& .chip': {
                marginBottom: 4,

                '&:not(:last-child)': {
                    marginRight: 4
                },

                '&.logos .MuiChip-root': {
                },
            },

            '& .schools': {
                display: 'flex',

                '& .school': {
                    "&:not(:last-child)": {
                        marginRight: 8
                    },

                    '& .MuiAvatar-root': {
                        width: 13,
                        height: 13,
                    }
                },
            },
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
                    fill: theme.palette.primary.dark,

                    [theme.breakpoints.down('md')]: {
                        width: '0.7em',
                        height: '0.7em',
                    }
                },

                '& .text': {
                    fontSize: '0.85em',
                    color: '#555',

                    [theme.breakpoints.down('md')]: {
                        fontSize: '0.8em'
                    }
                },
            }
        },

        '& .desc': {
            fontSize: '0.8em',
            marginTop: 4,
            color: '#6d6d6d',

            [theme.breakpoints.down('md')]: {
                fontSize: '0.785em'
            }
        }
    }
}))

const MotelCard = ({ listLayout, dataMotel }: Props) => {
    const classes = useStyles()
    const history = useHistory()

    const { _id, thumbnail, name, status, room, mark, address, createdAt, desc, school } = dataMotel

    const createdDate = new Date(createdAt || '')
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    let splitedDesc = desc.length > 250 ? desc.slice(0, 250) + '...' : desc

    const handleClickItem = () => {
        history.push(`/motels/${_id}`)
    }

    const LabelChipSchool = () => {
        return school.map((school: School) => (
            <li className='school'>
                <Tooltip title={school.name}>
                    <Avatar src={school.logo}>U</Avatar>
                </Tooltip>
            </li>
        ))
    }

    return (
        <Card className={`${classes.root} ${listLayout === 'grid' ? 'grid' : ''}`}>
            <CardActionArea
                style={{
                    width: '100%',
                    height: '100%',
                }}
                onClick={handleClickItem}>
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

                            <li key={school._id} className='chip logos'>
                                <ChipCustom
                                    label={
                                        <ul className='schools'>
                                            {LabelChipSchool()}
                                        </ul>
                                    }
                                    size='small'
                                    color='primary'
                                    title={school.name}
                                />
                            </li>
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
