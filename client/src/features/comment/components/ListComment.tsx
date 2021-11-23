import { Box } from '@material-ui/core'
import { useAppSelector } from 'app/hooks'
import { memo, Profiler } from 'react'
import { selectDataComment } from '../commentSlice'
import { Comment } from './Comment'

interface Props {

}

export const ListComment = memo((props: Props) => {
    const listComment = useAppSelector(selectDataComment)

    return (
        <Profiler id='list-comment' onRender={(id: string) => console.log(id, 'is rendering')}>

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
        </Profiler>
    )
})
