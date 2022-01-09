import { Box } from "@material-ui/core"
import { useAppDispatch } from "app/hooks"
import { MainLayout } from "components/Layouts/MainLayout"
import { ListPostSection } from "features/posts/components"
import { postAction } from "features/posts/postSlice"
import { useEffect } from "react"

const PostPage = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        return () => {
            dispatch(postAction.resetFilter())
        }
    }, [])

    return (
        <MainLayout>
            <Box
                className='container'
                mt={12}
            >
                <ListPostSection />
            </Box>
        </MainLayout>
    )
}

export default PostPage
