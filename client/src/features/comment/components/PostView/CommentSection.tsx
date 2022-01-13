import { Box, Typography } from '@material-ui/core'
import commentApi from 'api/comment'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { commentAction, selectFilterComment } from 'features/comment/commentSlice'
import { postAction, selectDataPost, selectFilterPost } from 'features/posts/postSlice'
import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { TypingComment } from '..'
import { CommentContext } from '../../contexts/CommentContext'
import { ListComment } from '../ListComment'


export const CommentSection = () => {
    const dispatch = useAppDispatch()
    const commentFilter = useAppSelector(selectFilterComment)
    const postFilter = useAppSelector(selectFilterPost)
    const postData = useAppSelector(selectDataPost)

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
                dispatch(commentAction.setFilter({ ...commentFilter }))
                dispatch(postAction.setFilter({ ...postFilter }))
                typingRef.current?.resetValue()
                toast.success("Đăng bình luận thành công!!!")
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }

    const handleSubmitReply = useCallback((commentReplyId: string, userId: string, content: string) => {
        commentApi.addReply(id, content, commentReplyId, userId)
            .then(() => {
                dispatch(commentAction.setFilter({ ...commentFilter }))
                dispatch(postAction.setFilter({ ...postFilter }))
                setTyping({
                    id: '',
                    username: ''
                })
                toast.success("Đăng bình luận thành công!!!")
            })
            .catch(err => {
                toast.error(err.response.data.message)
            })
    }, [commentFilter, dispatch, id, postFilter])

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
                    {postData && !postData?.block ? <TypingComment
                        handleSubmit={handleSubmitComment}
                        ref={typingRef}
                    />
                        : <Box
                            my={3}
                            style={{
                                width: '100%',
                                display: 'grid',
                                placeItems: 'center',
                                background: "#ccc",
                                padding: 12,
                                borderRadius: 5
                            }}>
                            <Typography>
                                Bài viết này đã vô hiệu chức năng bình luận
                            </Typography>
                        </Box>}
                </Box>

                <ListComment />
            </Box>
        </CommentContext.Provider>
    )
}
