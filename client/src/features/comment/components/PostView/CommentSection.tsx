import { Box } from '@material-ui/core'
import commentApi from 'api/comment'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { commentAction, selectFilterComment } from 'features/comment/commentSlice'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { TypingComment } from '..'
import { CommentContext } from '../../contexts/CommentContext'
import { ListComment } from '../ListComment'

interface Props {
}

export const CommentSection = ({ }: Props) => {
    const dispatch = useAppDispatch()
    const commentFilter = useAppSelector(selectFilterComment)

    const [typingDataComment, setTypingDataComment] = useState('')
    const { id } = useParams<{ id: string }>()

    const [typing, setTyping] = useState({
        id: '',
        username: ''
    })

    const handleRely = useCallback((idRepling: string, usernameRepling: string) => {
        setTyping(prev => prev.id === idRepling ? { id: '', username: '' } : { id: idRepling, username: usernameRepling })
    }, [])

    const handleSubmitComment = () => {
        commentApi.add(id, typingDataComment)
            .then(() => {
                toast.success("Đăng bình luận thành công!!!")
                dispatch(commentAction.setFilter({ ...commentFilter }))
                setTypingDataComment('')
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const handleSubmitReply = useCallback((commentReplyId: string, userId: string, content: string) => {
        commentApi.addReply(id, content, commentReplyId, userId)
            .then(() => {
                toast.success("Đăng bình luận thành công!!!")
                dispatch(commentAction.setFilter({ ...commentFilter }))
                setTypingDataComment('')
                setTyping({
                    id: '',
                    username: ''
                })
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }, [])

    return (
        <CommentContext.Provider value={
            {
                typing,
                setTyping,
                handleRely,
                handleSubmitReply
            }
        }>
            <Box component='section'>
                <Box
                    id='comment'
                    mb={2}
                >
                    <TypingComment
                        data={typingDataComment}
                        setData={setTypingDataComment}
                        handleSubmit={handleSubmitComment}
                    />
                </Box>

                <ListComment />

                {/* <Box
                display='flex'
                justifyContent='flex-end'
                mt={8}
            >
                <Pagination
                    count={10}
                    size="small"
                    shape='rounded'
                    hideNextButton
                    hidePrevButton
                    color='primary'
                />
            </Box>

            <Box
                mb={2}
            >
                <TypingComment
                    data={userCommentData}
                    setData={setUserCommentData}
                />
            </Box> */}
            </Box>
        </CommentContext.Provider>
    )
}
