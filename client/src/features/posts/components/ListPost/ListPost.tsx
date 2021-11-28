import { Box, Theme } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { postAction, selectFilterPost, selectListDataPost, selectLoadingPost, selectPaginationPost } from "features/posts/postSlice"
import { Post } from "./Post"
import { Loading } from 'components/Common'
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(1.5)
        }
    }
}))

export const ListPost = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()

    const listPost = useAppSelector(selectListDataPost)
    const filterPost = useAppSelector(selectFilterPost)

    const paginationPost = useAppSelector(selectPaginationPost)
    const loading = useAppSelector(selectLoadingPost)

    const handlePagination = (e: object, page: number) => {
        dispatch(postAction.setFilter({
            ...filterPost,
            _page: page
        }))
    }

    return (
        <Box
            className={classes.root}
            padding={[0, 3]}
        >
            {!loading ? <>
                <ul className="wrapper">
                    {listPost.map(post => (
                        <Post key={post._id} postData={post} />
                    ))}
                </ul>

                <Box
                    display='flex'
                    justifyContent='center'
                >
                    <Pagination
                        count={Math.ceil(paginationPost._limit / paginationPost._totalRows)}
                        color='primary'
                        shape='rounded'
                        size='small'
                        onChange={handlePagination}
                    />
                </Box>
            </>
                : <Box
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                    style={{
                        width: '100%',
                        height: 300
                    }}>
                    <Loading />
                </Box>
            }
        </Box>
    )
}
