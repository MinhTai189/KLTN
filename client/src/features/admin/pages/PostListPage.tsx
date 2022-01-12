import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Operation, PostTable } from "features/posts/components"
import { postAction, selectFilterPost, selectLoadingPost } from "features/posts/postSlice"
import { Filter } from "models"
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

    const handleSearch = (value: Filter) => {
        dispatch(postAction.searchWidthDebounce(value))
    }

    const handleFilter = (e: any, key: string) => {
        let newFilter = {};

        if (key === '_sort') {
            if (e) {
                const [_sort, _order] = e.split('.')

                newFilter = {
                    ...filter,
                    _sort,
                    _order
                }
            } else {
                newFilter = {
                    ...filter,
                    _sort: e,
                    _order: e
                }
            }
        }

        if (key === '_subject') {
            newFilter = {
                ...filter,
                ...newFilter,
                [key]: e
            }
        }

        if (key === '_block') {
            newFilter = {
                ...filter,
                ...newFilter,
                [key]: e === '1' ? true : e === '0' ? false : undefined
            }
        }

        dispatch(postAction.setFilter(newFilter))
    }

    const handleClearFilter = () => {
        dispatch(postAction.setFilter({
            _page: 1,
            _limit: 15,
        }))
    }

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    <Operation handleSearch={handleSearch} handleFilter={handleFilter} handleClearFilter={handleClearFilter} />
                </Box>


                <PostTable loading={loading} />
            </Box>
        </Box>
    )
}

export default PostListPage
