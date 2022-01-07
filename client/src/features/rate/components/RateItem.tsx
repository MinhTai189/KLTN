import { Theme, Tooltip, Typography } from '@material-ui/core'
import { Report, Star, StarBorder, StarHalf } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { UserTooltip } from 'components/Common'
import { Rate } from 'models'
import { Link } from 'react-router-dom'
import { roundMark } from 'utils'

interface Props {
    data: Rate
    handleReport: (id: string) => void
}

interface Color {
    bad: string
    fine: string
    good: string
    excellent: string
}

const useStyles = makeStyles<Theme, Color>(theme => ({
    root: {
        minHeight: 80,
        minWidth: 150,
        display: 'flex',
    },
    colLeft: {
        '& img': {
            width: '3.5em',
            height: '3.5em',
            borderRadius: '50%',

            [theme.breakpoints.down('sm')]: {
                width: '2.6em',
                height: '2.6em',
            },

            [theme.breakpoints.down('sm')]: {
                width: '2em',
                height: '2em',
            },
        },
    },
    colRight: {
        background: '#eee',
        padding: theme.spacing(1, 1.5),
        marginLeft: theme.spacing(1),
        borderRadius: 8,
        height: 'fit-content',

        [theme.breakpoints.down('sm')]: {
            padding: theme.spacing(1),
        },

        [theme.breakpoints.down('xs')]: {
            marginLeft: theme.spacing(0.5),
            padding: theme.spacing(0.5),
            borderRadius: 4,
        },

        '& .top': {
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing(0.3),

            '& .name': {
                fontSize: 13,
                cursor: 'pointer',
                transition: '300ms ease',
                textTransform: 'capitalize',
                whiteSpace: 'nowrap',
                lineHeight: 1,

                [theme.breakpoints.down('sm')]: {
                    fontSize: 12
                },

                [theme.breakpoints.down('xs')]: {
                    fontSize: 11
                },

                '&:hover': {
                    textDecoration: 'underline'
                }
            },

            '& .stars': {
                marginLeft: 8,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',

                [theme.breakpoints.down('sm')]: {
                    marginLeft: 4,
                },

                '& span': {
                    lineHeight: 1,
                    height: 10,
                    display: 'flex'
                },

                '& .MuiSvgIcon-root': {
                    width: 15,
                    height: 15,
                    fill: theme.palette.primary.main,

                    [theme.breakpoints.down('sm')]: {
                        width: 10,
                        height: 10,
                    },

                    [theme.breakpoints.down('xs')]: {
                        width: 8,
                        height: 8,
                    },

                    '&:nth-child(3)': {

                    }
                },

                '&.excellent .MuiSvgIcon-root': {
                    fill: ({ excellent }: Color) => excellent
                },

                '&.good .MuiSvgIcon-root': {
                    fill: ({ good }: Color) => good
                },
                '&.fine .MuiSvgIcon-root': {
                    fill: ({ fine }: Color) => fine
                },
                '&.bad .MuiSvgIcon-root': {
                    fill: ({ bad }: Color) => bad
                },
            }
        },

        '& .text': {
            fontSize: 13,
            marginBottom: 4,
            marginBlock: theme.spacing(0.5),

            [theme.breakpoints.down('sm')]: {
                fontSize: 12,
                lineHeight: 1.3
            },

            [theme.breakpoints.down('xs')]: {
                fontSize: 11,
                lineHeight: 1.2
            },
        },

        '& .bottom': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            '& .date': {
                fontSize: 10,
                fontWeight: 500,
                color: theme.palette.text.secondary,

                [theme.breakpoints.down('sm')]: {
                    fontSize: 9
                },
            },

            '& .reportBtn': {
                width: 14,
                height: 14,
                display: 'grid',
                placeItems: 'center',

                [theme.breakpoints.down('xs')]: {
                    width: 11,
                    height: 11,
                },

                '& .MuiSvgIcon-root': {
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                    opacity: 0.4,
                    transition: '300ms',

                    '&:hover': {
                        opacity: 1
                    }
                }
            }
        }
    }
}))

const colorBoard: Color = {
    bad: '#f44336',
    fine: '#ff9800',
    good: '#2196f3',
    excellent: '#4caf50'
}

const hanldeColor = (rate: number) => {
    if (rate <= 1)
        return 'bad'
    else if (rate > 1 && rate <= 3.5)
        return 'fine'
    else if (rate > 3.5 && rate < 5)
        return 'good'
    return 'excellent'
}

export const RateItem = ({ data, handleReport }: Props) => {
    const classes = useStyles(colorBoard)

    const createdDate = new Date(data.createAt)
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' })
    let markToStar = roundMark(data.star as number) || [0, 0]

    const colorStar = hanldeColor(data.star)

    const Stars = () => {
        const stars = new Array(5).fill(1).map((_, index) => {
            if (markToStar[0] > 0) {
                markToStar[0] = markToStar[0] - 1
                return <Star key={index} />
            } else if (markToStar[1] !== 0) {
                markToStar[1] = 0
                return <StarHalf key={index} />
            }
            return <StarBorder key={index} />
        })

        const span1 = <span>{[stars[0], stars[1]]}</span>
        const span2 = <span>{[stars[2], stars[3], stars[4]]}</span>

        return [span1, span2]
    }

    return (
        <div className={classes.root}>
            <div className={classes.colLeft}>
                <UserTooltip data={data.user}>
                    <img src={data.user.avatarUrl} alt="avatar" />
                </UserTooltip>
            </div>
            <div className={classes.colRight}>
                <div className="top">
                    <Typography className='name' variant='h6'>
                        <Link to={`/profile/${data.user._id}`}>
                            {data.user.name}
                        </Link>
                    </Typography>

                    <div className={`stars ${colorStar}`}>
                        {Stars()}
                    </div>
                </div>

                <Typography className='text'>
                    {data.content}
                </Typography>

                <div className="bottom">
                    <Tooltip title='Báo cáo đánh giá này không phù hợp'>
                        <span className='reportBtn' onClick={() => handleReport(data._id)}>
                            <Report />
                        </span>
                    </Tooltip>

                    <Typography className='date' component='small'>{date}</Typography>
                </div>
            </div>
        </div>
    )
}
