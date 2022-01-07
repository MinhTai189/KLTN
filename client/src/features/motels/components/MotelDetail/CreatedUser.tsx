import { Theme, Tooltip, Typography } from '@material-ui/core'
import { AccountBalance, CloudUpload, DateRange, Email, Redeem } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { OwnerDetail } from 'models'
import { Link } from 'react-router-dom'

interface Props {
    owner: OwnerDetail
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',

        '& .avatar': {
            width: '5em',
            height: '5em',
            objectFit: 'cover',
            marginRight: 6,
            border: '1px solid #ccc',
            borderRadius: 5,

            [theme.breakpoints.only('sm')]: {
                width: '3.5em',
                height: '3.5em',
            },
        },

        '& .info': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            '& .name': {
                fontSize: '1em',
                fontWeight: 500,
                transition: '300ms',
                cursor: 'pointer',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',

                [theme.breakpoints.only('sm')]: {
                    fontSize: '0.9em'
                },

                "&:hover": {
                    textDecoration: 'underline'
                }
            },
            '& .row': {
                fontSize: '0.8em',
                color: '#666',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'flex-end',

                [theme.breakpoints.only('sm')]: {
                    fontSize: '0.65em'
                },

                '& .MuiSvgIcon-root': {
                    width: '0.6em',
                    height: '0.6em',
                    marginRight: 4,

                    [theme.breakpoints.only('sm')]: {
                        width: '0.5em',
                        height: '0.5em',
                        marginRight: 2,
                    },
                },

                '&:not(:last-child)': {
                    marginBottom: 4
                },
            },
        },

        '& .controls': {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',

            [theme.breakpoints.only('sm')]: {
                flexDirection: 'row',
                justifyContent: 'center',
                gap: theme.spacing(3),
                width: '100%',
                marginTop: theme.spacing(1)
            },

            '& .control': {
                display: 'grid',
                placeItems: 'center',

                '& .MuiSvgIcon-root': {
                    width: '0.65em',
                    height: '0.65em',

                    [theme.breakpoints.only('sm')]: {
                        width: '0.55em',
                        height: '0.55em',
                    },
                },

                '&.email .MuiSvgIcon-root': {
                    fill: '#ea4335',
                },

                '&.article .MuiSvgIcon-root': {
                    fill: '#4486f4',
                },

                '&.score .MuiSvgIcon-root': {
                    fill: '#dc004e',
                },
            }
        }
    }
}))

export const CreatedUser = ({ owner }: Props) => {
    const classes = useStyles()
    const { _id, avatarUrl, name, rank, email, motels, credit, createdAt } = owner

    const createdDate = new Date(createdAt)
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })


    return (
        <div className={classes.root}>
            <img src={avatarUrl} alt="avatar" className="avatar" />

            <div className="info">
                <Typography className='name'>
                    <Link to={`/profile/${_id}`}>
                        {name}
                    </Link>
                </Typography>

                <div>
                    <Typography className='row'>
                        <Redeem />
                        {rank}
                    </Typography>

                    <Typography className='row'>
                        <DateRange />
                        {date}
                    </Typography>
                </div>
            </div>

            <div className="controls">
                <span className="control email">
                    <Tooltip title={email}>
                        <Email />
                    </Tooltip>
                </span>
                <span className="control article">
                    <Tooltip title={`${motels} bài đăng`}>
                        <CloudUpload />
                    </Tooltip>
                </span>
                <span className="control score">
                    <Tooltip title={`${credit} điểm`}>
                        <AccountBalance />
                    </Tooltip>
                </span>
            </div>
        </div>
    )
}
