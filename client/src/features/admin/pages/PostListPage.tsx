import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Operation, PostTable } from "features/posts/components"
import { postAction, selectFilterPost, selectLoadingPost } from "features/posts/postSlice"
import { useEffect } from "react"

const PostListPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterPost)
    const loading = useAppSelector(selectLoadingPost)

    useEffect(() => {
        dispatch(postAction.get({
            ...filter,
            _limit: 15
        }))
    }, [filter])

    useEffect(() => {
        return () => {
            dispatch(postAction.resetFilter())
        }
    }, [])

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    {/* <Operation handleSearch={handleSearch} handleFilter={handleFilter} handleClearFilter={handleClearFilter} /> */}
                    <Operation />
                </Box>


                <PostTable loading={loading} />
            </Box>
        </Box>
    )
}

export default PostListPage
