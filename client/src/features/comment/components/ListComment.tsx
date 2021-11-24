import { Box } from '@material-ui/core'
import { useAppSelector } from 'app/hooks'
import { memo } from 'react'
import { selectDataComment } from '../commentSlice'
import { Comment } from './Comment'

export const ListComment = memo(() => {
    const listComment = useAppSelector(selectDataComment)

    return (

        <Box>
            {listComment.map(comment => {
                return (
                    <Comment
                        key={comment._id}
                        comment={comment}
                    />
                )
            })}
        </Box>
    )
})
