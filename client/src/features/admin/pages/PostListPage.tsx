import { Box, LinearProgress } from "@material-ui/core"
import { PostTable } from "features/posts/components"

const PostListPage = () => {

    return (
        <Box>
            {true && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    {/* <Operation handleSearch={handleSearch} handleFilter={handleFilter} handleClearFilter={handleClearFilter} /> */}
                </Box>


                <PostTable />
            </Box>
        </Box>
    )
}

export default PostListPage
