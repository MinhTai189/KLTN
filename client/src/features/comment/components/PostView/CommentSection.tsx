import { Box } from '@material-ui/core'
import commentApi from 'api/comment'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { commentAction, selectFilterComment } from 'features/comment/commentSlice'
import { Profiler, useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { TypingComment } from '..'
import { CommentContext } from '../../contexts/CommentContext'
import { ListComment } from '../ListComment'


export const CommentSection = () => {
    const dispatch = useAppDispatch()
    const commentFilter = useAppSelector(selectFilterComment)
    const { id } = useParams<{ id: string }>()
    const typingRef = useRef<any>()

    const [typing, setTyping] = useState({
        id: '',
        username: ''
    })

    const handleRely = useCallback((idRepling: string, usernameRepling: string) => {
        setTyping(prev => prev.id === idRepling ? { id: '', username: '' } : { id: idRepling, username: usernameRepling })
    }, [])

    const handleSubmitComment = () => {
        const content = typingRef.current?.getValue()
        if (!content) return

        commentApi.add(id, content)
            .then(() => {
                toast.success("Đăng bình luận thành công!!!")
                dispatch(commentAction.setFilter({ ...commentFilter }))
                typingRef.current?.resetValue()
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
                        handleSubmit={handleSubmitComment}
                        ref={typingRef}
                    />
                </Box>

                <Profiler id='list-comment' onRender={(id: string) => console.log(id, 'is rendering')}>
                    <ListComment />
                </Profiler>
            </Box>
        </CommentContext.Provider>
    )
}
