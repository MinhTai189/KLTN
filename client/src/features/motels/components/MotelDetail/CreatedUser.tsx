import { Theme, Tooltip, Typography } from '@material-ui/core'
import { AccountBalance, CloudUpload, DateRange, Email, Redeem } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { OwnerDetail } from 'models'

interface Props {
    owner: OwnerDetail
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',

        '& .avatar': {
            width: '5em',
            height: '5em',
            objectFit: 'cover',
            marginRight: 6,
            border: '1px solid #ccc',
            borderRadius: 5,
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

                '& .MuiSvgIcon-root': {
                    width: '0.6em',
                    height: '0.6em',
                    marginRight: 4
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

            '& .control': {
                display: 'grid',
                placeItems: 'center',

                '& .MuiSvgIcon-root': {
                    width: '0.65em',
                    height: '0.65em',
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
    const { avatarUrl, name, rank, email, motels, credit, createdAt } = owner

    const createdDate = new Date(createdAt)
    const date = createdDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })


    return (
        <div className={classes.root}>
            <img src={avatarUrl} alt="avatar" className="avatar" />

            <div className="info">
                <Typography className='name'>
                    {name}
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
