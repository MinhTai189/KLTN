import { Box, Grid } from "@material-ui/core"
import { PostView } from "./Post/PostView"


interface Props {

}

export const PostViewSection = (props: Props) => {
    return (
        <Box component='section'>
            <Grid container>
                <Grid item md={1}></Grid>
                <Grid item md={7}>
                    <PostView />
                </Grid>
                <Grid item md={4}></Grid>
            </Grid>
        </Box>
    )
}
