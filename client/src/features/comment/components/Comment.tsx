import { Avatar, Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Comment as CommentType } from 'models'
import { memo, useEffect, useRef, useState } from 'react'
import { CommentContext } from '../contexts/CommentContext'
import { CommentBody } from './CommentBody'
import { CommentLayout } from './Layout/CommentLayout'
import { ListSubComment } from './ListSubComent'
import { TypingComment } from './TypingComment'

interface Props {
    comment: CommentType
    dataReplingComment: string
    setDataReplingComment: (state: string) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
}))

export const Comment = memo(
    ({ comment, dataReplingComment, setDataReplingComment }: Props) => {
        const classes = useStyles()

        const { _id, owner: { avatarUrl }, reply } = comment

        useEffect(() => {

        }, [])

        return (
            <CommentContext.Consumer>
                {value => (
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
                                    data={dataReplingComment}
                                    setData={setDataReplingComment}
                                />}

                                <ListSubComment
                                    listReply={reply}
                                />
                            </>
                        </CommentLayout>
                    </Box>
                )}
            </CommentContext.Consumer>
        )
    }

)