import { Box, Grid } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { commentAction, selectFilterComment } from 'features/comment/commentSlice'
import { CommentSection } from 'features/comment/components'
import { MotelPreview } from "features/motels/components/PostView/MotelPreview"
import { PostViewSection } from 'features/posts/components'
import { MotelRecommendPost } from 'features/posts/components/PostView/Recommended/MotelRecommendPost'
import { RelatedPost } from 'features/posts/components/PostView/Recommended/RelatedPost'
import { postAction, selectDataPost, selectFilterPost } from 'features/posts/postSlice'
import { createContext, useEffect } from 'react'
import { useParams } from 'react-router'

const PostViewPage = () => {
    const dispatch = useAppDispatch()
    const filterComment = useAppSelector(selectFilterComment)
    const filterPost = useAppSelector(selectFilterPost)

    const postData = useAppSelector(selectDataPost)

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        dispatch(postAction.getById(id))

    }, [dispatch, filterPost])

    useEffect(() => {
        dispatch(commentAction.get({
            ...filterComment,
            _post: id
        }))
    }, [dispatch, filterComment])

    return (
        <MainLayout>
            <Box
                className='container'
                mt={12}
            >
                <Box>
                    <Grid container spacing={2}>
                        <Grid item md={1}></Grid>
                        <Grid item md={7}>
                            {postData && <PostViewSection postData={postData} />}

                            <Box my={4}>
                                <RelatedPost />
                            </Box>

                            <Box my={4}>
                                <MotelRecommendPost />
                            </Box>

                            <Box
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

                            <CommentSection />
                        </Grid>
                        <Grid item md={3}>
                            {postData && postData.motel && <MotelPreview motelData={postData.motel} />}
                        </Grid>
                        <Grid item md={1}></Grid>
                    </Grid>
                </Box>
            </Box>
        </MainLayout>
    )
}

export default PostViewPage
