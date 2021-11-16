import { Box } from "@material-ui/core"
import { MainLayout } from "components/Layouts/MainLayout"
import { ListPostSection } from "features/posts/components"


interface Props {

}

const PostPage = (props: Props) => {
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
