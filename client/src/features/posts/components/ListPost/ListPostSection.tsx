import { Box, Grid } from "@material-ui/core"
import { ListPost } from "./ListPost"
import { ListThread } from "./ListThread"


interface Props {

}

export const ListPostSection = (props: Props) => {
    return (
        <Box component='section'>
            <Grid container>
                <Grid item md={2}>
                    <ListThread />
                </Grid>

                <Grid item md={8}>
                    <ListPost />
                </Grid>

                <Grid item md={2}></Grid>
            </Grid>
        </Box>
    )
}
