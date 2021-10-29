import { Theme, Tooltip, Typography } from '@material-ui/core'
import { AccountBalance, CloudUpload, DateRange, Email, Redeem, School } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

interface Props {

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

export const CreatedUser = (props: Props) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img src='data:image/jpeg;base64,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' alt="avatar" className="avatar" />

            <div className="info">
                <Typography className='name'>
                    Trần Minh Tài
                </Typography>

                <div>
                    <Typography className='row'>
                        <Redeem />
                        Admin
                    </Typography>

                    <Typography className='row'>
                        <DateRange />
                        12/12/2012
                    </Typography>
                </div>
            </div>

            <div className="controls">
                <span className="control email">
                    <Tooltip title={'tranminhtai189@gmail.com' || ''}>
                        <Email />
                    </Tooltip>
                </span>
                <span className="control article">
                    <Tooltip title={`${0} bài đăng`}>
                        <CloudUpload />
                    </Tooltip>
                </span>
                <span className="control score">
                    <Tooltip title={`${0} điểm`}>
                        <AccountBalance />
                    </Tooltip>
                </span>
            </div>
        </div>
    )
}
