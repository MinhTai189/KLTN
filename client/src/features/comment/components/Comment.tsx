import { Avatar, Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Comment as CommentType } from 'models'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { CommentContext } from '../contexts/CommentContext'
import { CommentBody } from './CommentBody'
import { CommentLayout } from './Layout/CommentLayout'
import { ListSubComment } from './ListSubComent'
import { TypingComment } from './TypingComment'

interface Props {
    comment: CommentType
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}))

export const Comment = memo(({ comment }: Props) => {
    const classes = useStyles()
    const replyRef = useRef<any>()
    const value = useContext(CommentContext)

    const { _id, owner: { avatarUrl, _id: userId }, reply } = comment

    const handleReply = () => {
        if (replyRef.current)
            value.handleSubmitReply(_id, userId, replyRef.current.getValue())
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
                        comment={comment}
                    />

                    {value.typing.id === _id && <TypingComment
                        isRely
                        repliedUserName={value.typing.username}
                        ref={replyRef}
                        handleSubmit={() => handleReply()}
                    />}

                    <ListSubComment
                        listReply={reply}
                    />
                </>
            </CommentLayout>
        </Box>
    )
}
)