import { Avatar, Box, Theme, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { TYPE_MESSAGE } from "constant/constant"
import { NotifyNewMessage } from "models"

interface Props {
    notify: NotifyNewMessage
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .group': {
            fontSize: '1rem',
        },

        '& .info': {
            display: 'flex',
            alignItems: 'center',

            '& .avatar': {
                marginRight: 8,
                width: 30,
                height: 30
            },

            '& .content': {
                fontSize: '0.8rem'
            }
        }
    }
}))

export const ToastifyContent = ({ notify }: Props) => {
    const classes = useStyles()

    const { group: { name }, message: { owner: { avatarUrl }, content, type, urlImages } } = notify

    const convertContent = {
        [TYPE_MESSAGE.text]: content.length > 50 ? `${content.slice(0, 50)}...` : content,
        [TYPE_MESSAGE.link]: content.length > 50 ? `${content.slice(0, 50)}...` : content,
        [TYPE_MESSAGE.image]: `Đã gửi ${urlImages?.length} ảnh`,
        [TYPE_MESSAGE.gif]: "Đã gửi 1 ảnh Gif",
    }

    return (
        <Box className={classes.root}>
            <Typography variant='h5' className="group">
                Nhóm: <b>{name}</b>
            </Typography>

            <Box className='info'>
                <Avatar className='avatar' sizes='small' src={avatarUrl}>U</Avatar>

                <Typography className='content'>
                    {convertContent[type]}
                </Typography>
            </Box>
        </Box>
    )
}
