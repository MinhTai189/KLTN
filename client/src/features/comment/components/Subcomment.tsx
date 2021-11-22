import { Avatar, Box, makeStyles, Theme } from '@material-ui/core'
import { ReplingComment } from 'models'
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

    const { _id, owner: { avatarUrl } } = replyData

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
                            />

                            {value.typing.id === _id && <TypingComment
                                isRely
                                repliedUserName={value.typing.username}
                                data={value?.dataReplingComment || ''}
                                setData={value?.setDataReplingComment || (() => { })}
                            />}
                        </>
                    </CommentLayout>
                </Box>
            )}
        </CommentContext.Consumer>
    )
}
