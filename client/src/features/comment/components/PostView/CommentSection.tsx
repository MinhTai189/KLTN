import { Box } from '@material-ui/core'
import { useCallback, useState } from 'react'
import { TypingComment } from '..'
import { CommentContext } from '../../contexts/CommentContext'
import { ListComment } from '../ListComment'

interface Props {
}

export const CommentSection = ({ }: Props) => {
    const [typingDataComment, setTypingDataComment] = useState('')
    const [dataReplingComment, setDataReplingComment] = useState('')

    const [typing, setTyping] = useState({
        id: '',
        username: ''
    })

    const handleRely = useCallback((idRepling: string, usernameRepling: string) => {
        setTyping(prev => prev.id === idRepling ? { id: '', username: '' } : { id: idRepling, username: usernameRepling })
    }, [])

    return (
        <CommentContext.Provider value={
            {
                dataReplingComment,
                setDataReplingComment,
                typing,
                setTyping,
                handleRely,
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
