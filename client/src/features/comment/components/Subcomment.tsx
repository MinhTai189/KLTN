import { Avatar, Box, makeStyles, Theme } from '@material-ui/core'
import { ReplingComment } from 'models'
import { useState } from 'react'
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
    const [replingData, setReplingData] = useState('')

    const { _id, owner: { avatarUrl, _id: userId }, user } = replyData

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
                                comment={replyData}
                                repliedUser={user}
                            />

                            {value.typing.id === _id && <TypingComment
                                isRely
                                repliedUserName={value.typing.username}
                                data={replingData}
                                setData={setReplingData}
                                handleSubmit={() => value.handleSubmitReply(_id, userId, replingData)}
                            />}
                        </>
                    </CommentLayout>
                </Box>
            )}
        </CommentContext.Consumer>
    )
}
