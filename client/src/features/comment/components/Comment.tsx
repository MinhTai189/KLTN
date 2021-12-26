import { Avatar, Box, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import commentApi from 'api/comment'
import { UserTooltip } from 'components/Common'
import { Comment as CommentType, Filter, ReplingComment } from 'models'
import { memo, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
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

    const [listRepling, setListRepling] = useState<Array<ReplingComment>>([])
    const [filter, setFilter] = useState<Filter>({
        _limit: 5,
        _page: 1,
        _count: 1
    })

    const totalReply = useRef(0)

    const { _id, owner: { avatarUrl, _id: userId }, owner } = comment

    const handleReply = () => {
        if (replyRef.current)
            value.handleSubmitReply(_id, userId, replyRef.current.getValue())
    }

    useEffect(() => {
        commentApi.getSubcomment(_id, filter)
            .then(res => {
                totalReply.current = res.pagination._totalRows
                setListRepling(res.data)
            })
            .catch(() => toast.error('Không thể tải danh sách trả lời!'))
    }, [comment, filter])

    const handleLoadMoreReply = () => {
        if (filter._limit! >= totalReply.current)
            return

        setFilter({
            ...filter,
            _limit: filter._limit! + 5,
            _count: filter._count! + 1
        })
    }

    return (
        <Box
            className={classes.root}
            my={2}
        >
            <CommentLayout
                avatar={<UserTooltip data={owner}>
                    <Avatar
                        className='avatar'
                        src={avatarUrl}
                    />
                </UserTooltip>}
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

                    {listRepling.length > 0 && <ListSubComment
                        listReply={listRepling}
                        totalReply={totalReply.current}
                        currentReply={filter._count ?? 1}
                        handleLoadMoreReply={handleLoadMoreReply}
                    />}
                </>
            </CommentLayout>
        </Box>
    )
}
)