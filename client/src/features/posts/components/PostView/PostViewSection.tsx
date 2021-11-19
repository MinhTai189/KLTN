import { Box, Grid } from "@material-ui/core"
import { useAppSelector } from "app/hooks"
import { MotelPreview } from "features/motels/components/PostView/MotelPreview"
import { selectDataPost } from "features/posts/postSlice"
import { PostView } from "./Post/PostView"


interface Props {

}

export const PostViewSection = (props: Props) => {
    const postData = useAppSelector(selectDataPost)

    return (
        <Box component='section'>
            <Grid container spacing={2}>
                <Grid item md={1}></Grid>
                <Grid item md={7}>
                    {postData && <PostView postData={postData} />}
                </Grid>
                <Grid item md={3}>
                    {postData && postData.motel && <MotelPreview motelData={postData.motel} />}
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </Box>
    )
}
