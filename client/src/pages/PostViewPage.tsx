import { Box } from '@material-ui/core'
import { MainLayout } from 'components/Layouts/MainLayout'
import { PostViewSection } from 'features/posts/components'

interface Props {

}

const PostViewPage = (props: Props) => {
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
