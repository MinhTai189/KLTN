import { Avatar, Box, makeStyles, Theme } from '@material-ui/core'
import { ReplingComment } from 'models'
import { useContext, useRef } from 'react'
import { CommentLayout, TypingComment } from '.'
import { CommentContext } from '../contexts/CommentContext'
import { CommentBody } from './CommentBody'

interface Props {
    replyData: ReplingComment
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}))

export const Subcomment = ({ replyData }: Props) => {
    const classes = useStyles()
    const replyRef = useRef<any>()
    const value = useContext(CommentContext)

    const { _id, owner: { avatarUrl, _id: userId }, user } = replyData

    const handleReply = () => {
        if (replyRef.current)
            value.handleSubmitReply(_id, userId, replyRef.current.value)
    }

    return (
        <Box
            className={classes.root}
            my={2}
        >
            <CommentLayout
                totalAction={true}
                avatar={<Avatar
                    className='avatar'
                    src={avatarUrl}
                />}
            >
                <>
                    <CommentBody
                        sizeAction='small'
                        positionAction='left'
                        comment={replyData}
                        repliedUser={user}
                    />

                    {value.typing.id === _id && <TypingComment
                        isRely
                        repliedUserName={value.typing.username}
                        handleSubmit={() => handleReply()}
                    />}
                </>
            </CommentLayout>
        </Box>
    )
}
