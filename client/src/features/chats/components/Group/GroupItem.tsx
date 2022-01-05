import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core"

interface Props {
    actived?: boolean
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        cursor: 'pointer',
        padding: theme.spacing(1, 0.5),
        borderRadius: 8,
        transition: '300ms',

        '&.active': {
            background: '#c4d9e9 !important',
        },

        '&:hover': {
            background: '#edeef2'
        },

        '& .avatar': {
            width: 50,
            height: 50,
            marginRight: theme.spacing(1)
        },

        '& .info': {
            '& .name': {
                fontSize: '1rem',
                fontWeight: 500
            },

            '& .row': {
                display: 'flex',
                alignItems: 'center',

                '& .text': {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: 150,
                    color: theme.palette.text.secondary,
                    fontSize: '0.85rem'
                },

                '& .date': {
                    fontSize: '0.7rem',
                    color: theme.palette.text.secondary
                }
            }
        }
    }
}))

const GroupItem = ({ actived }: Props) => {
    const classes = useStyles()

    return (
        <Box className={`${classes.root} ${actived ? 'active' : ''}`}>
            <Avatar className="avatar">
                U
            </Avatar>

            <Box className='info' component='span'>
                <Typography className="name" variant="h4">
                    Giao lưu, trao đổi, hỏi đáp
                </Typography>

                <Box className='row'>
                    <Typography className="text">
                        Bạn: ok
                    </Typography>

                    <Typography className='date'>
                        &#xa0;&#x22C5;&#xa0;43 phút trước
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default GroupItem
