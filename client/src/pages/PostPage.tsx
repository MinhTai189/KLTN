import { Box } from "@material-ui/core"
import { MainLayout } from "components/Layouts/MainLayout"
import { ListPostSection } from "features/posts/components"

const PostPage = () => {
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
