import { Theme, Tooltip, Typography } from '@material-ui/core'
import { Report, Star, StarBorder, StarHalf } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { Rate } from 'models'
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
        minWidth: 300,
        display: 'flex',
        padding: theme.spacing(2, 0)
    },
    colLeft: {
        '& img': {
            width: '3.5em',
            height: '3.5em',
            borderRadius: '50%',
        },
    },
    colRight: {
        background: '#eee',
        padding: theme.spacing(1, 1.5),
        marginLeft: theme.spacing(1),
        borderRadius: 15,
        minWidth: 180,

        '& .top': {
            display: 'flex',
            alignItems: 'center',

            '& .name': {
                fontSize: 13,
                cursor: 'pointer',
                transition: '300ms ease',
                textTransform: 'capitalize',

                '&:hover': {
                    textDecoration: 'underline'
                }
            },

            '& .stars': {
                marginLeft: 8,

                '& .MuiSvgIcon-root': {
                    width: 15,
                    height: 15,
                    fill: theme.palette.primary.main
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
        },

        '& .bottom': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            '& .date': {
                fontSize: 10,
                fontWeight: 500,
                color: theme.palette.text.secondary
            },

            '& .reportBtn': {
                width: 14,
                height: 14,
                display: 'grid',
                placeItems: 'center',

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

    return (
        <div className={classes.root}>
            <div className={classes.colLeft}>
                <img src={data.user.avatarUrl} alt="avatar" />
            </div>
            <div className={classes.colRight}>
                <div className="top">
                    <Typography className='name' variant='h6'>
                        {data.user.name}
                    </Typography>

                    <div className={`stars ${colorStar}`}>
                        {new Array(5).fill(1).map((_, index) => {

                            if (markToStar[0] > 0) {
                                markToStar[0] = markToStar[0] - 1
                                return <Star key={index} />
                            } else if (markToStar[1] !== 0) {
                                markToStar[1] = 0
                                return <StarHalf key={index} />
                            }
                            return <StarBorder key={index} />
                        })}
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
