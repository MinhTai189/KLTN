import { Box, Grid, Theme } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { commentAction, selectFilterComment, selectPaginationComment } from 'features/comment/commentSlice'
import { CommentSection } from 'features/comment/components'
import { MotelPreview } from "features/motels/components/PostView/MotelPreview"
import { PostViewSection } from 'features/posts/components'
import { MotelRecommendPost } from 'features/posts/components/PostView/Recommended/MotelRecommendPost'
import { RelatedPost } from 'features/posts/components/PostView/Recommended/RelatedPost'
import { postAction, selectDataPost, selectFilterPost } from 'features/posts/postSlice'
import { Pagination as PaginationModel } from 'models'
import { useEffect } from 'react'
import { useParams } from 'react-router'

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .motel-side': {
            [theme.breakpoints.down('md')]: {
                display: 'none'
            }
        },

        '& .motel-mobile': {
            display: 'none',
            width: '100%',
            maxWidth: 450,

            [theme.breakpoints.down('md')]: {
                display: 'block',
            }
        },
    }
}))

const PostViewPage = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()
    const filterComment = useAppSelector(selectFilterComment)
    const filterPost = useAppSelector(selectFilterPost)

    const paginationComment: PaginationModel = useAppSelector(selectPaginationComment)

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

    const handlePaginationComment = (e: object, page: number) => {
        dispatch(commentAction.setFilter({
            ...paginationComment,
            _page: page,
        }))
    }

    return (
        <MainLayout>
            <Box
                className='container'
                mt={12}
            >
                <Box className={classes.root}>
                    <Grid container>
                        <Grid item xs={undefined} sm={undefined} md={undefined} lg={undefined} xl={1}></Grid>
                        <Grid item xs={12} sm={12} md={12} lg={8} xl={7}>
                            {postData && <PostViewSection postData={postData} />}

                            <Box className='motel-mobile'>
                                {postData && postData.motel && <MotelPreview motelData={postData.motel} />}
                            </Box>

                            {paginationComment._page <= 1 && <>
                                {postData && <Box my={4}>
                                    <RelatedPost listPost={postData.posts} />
                                </Box>}

                                {postData && <Box my={4}>
                                    <MotelRecommendPost listMotel={postData.motels} />
                                </Box>}
                            </>}

                            <Box
                                display='flex'
                                justifyContent='flex-end'
                                mt={8}
                            >
                                <Pagination
                                    count={Math.ceil(paginationComment._totalRows / paginationComment._limit)}
                                    onChange={handlePaginationComment}
                                    size="small"
                                    shape='rounded'
                                    hideNextButton
                                    hidePrevButton
                                    color='primary'
                                />
                            </Box>

                            <CommentSection />
                        </Grid>
                        <Grid className='motel-side' item xs={undefined} sm={undefined} md={undefined} lg={4} xl={3}>
                            {postData && postData.motel && <MotelPreview motelData={postData.motel} />}
                        </Grid>
                        <Grid item xs={undefined} sm={undefined} md={undefined} lg={undefined} xl={1}></Grid>
                    </Grid>
                </Box>
            </Box>
        </MainLayout>
    )
}

export default PostViewPage
