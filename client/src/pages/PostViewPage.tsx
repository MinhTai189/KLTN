import { Box } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { commentAction, selectFilterComment } from 'features/comment/commentSlice'
import { PostViewSection } from 'features/posts/components'
import { postAction } from 'features/posts/postSlice'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const PostViewPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterComment)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        dispatch(postAction.getById(id))

    }, [dispatch])

    useEffect(() => {
        dispatch(commentAction.get({
            ...filter,
            _post: id
        }))
    }, [dispatch, filter])

    return (
        <MainLayout>
            <Box
                className='container'
                mt={12}
            >
                <PostViewSection />
            </Box>
        </MainLayout>
    )
}

export default PostViewPage
