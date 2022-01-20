import { Avatar, Box, makeStyles, Theme, Typography } from "@material-ui/core";
import { useAppSelector } from "app/hooks";
import { selectCurrentUser } from "features/auth/authSlice";
import { User } from "models";
import { forwardRef } from "react";
import { useHistory } from "react-router-dom";
import { CommentLayout } from ".";
import { TypingTextArea } from "./TypingTextArea";

interface Props {
    isRely?: boolean
    repliedUserName?: string
    handleSubmit: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .user-rely': {
            fontSize: '0.8em',
            marginBottom: 4,
            color: theme.palette.text.secondary
        },
    }
}))

export const TypingComment = forwardRef(({ isRely = false, repliedUserName, handleSubmit }: Props, ref) => {
    const classes = useStyles()
    const history = useHistory()

    const currentUser: User | undefined = useAppSelector(selectCurrentUser)

    return (
        <Box
            className={classes.root}
            mt={2}
            mb={3}
        >
            <CommentLayout avatar={<Avatar
                className='avatar'
                src={currentUser ? currentUser.avatarUrl : 'https://res.cloudinary.com/dpregsdt9/image/upload/v1637224758/user-avatar/avatar_male_m_ljdn9m.png'}
                style={{ background: '#e5e6ec' }}
            >
                U
            </Avatar>}
            >
                {currentUser ? <>
                    {isRely && <Typography className='user-rely'>
                        {`Bạn đang trả lời ${repliedUserName}...`}
                    </Typography>}

                    <TypingTextArea
                        handleSubmit={handleSubmit}
                        placeHolder={isRely ? 'Viết câu trả lời của bạn...' : 'Hãy viết một vài bình luận...'}
                        ref={ref as any}
                    />
                </>
                    : <Box
                        display='flex'
                        alignItems='center'
                        style={{ height: '100%', cursor: 'pointer' }}
                        onClick={() => history.push('/auth/login')}
                    >
                        <Typography style={{ color: 'rgba(0,0,0,0.7)' }} >
                            Đăng nhập một phát, tha hồ bình luận 😁
                        </Typography>
                    </Box>
                }
            </CommentLayout >
        </Box >
    )
})
