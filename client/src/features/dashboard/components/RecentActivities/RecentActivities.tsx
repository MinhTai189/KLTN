import { Box, Grid } from "@material-ui/core"
import RecentActivity from "./RecentActivity"
import RecentMotel from "./RecentMotel"

export const RecentActivities = () => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item lg={5}>
                    <RecentMotel />
                </Grid>
                <Grid item lg={7}>
                    <RecentActivity />
                </Grid>
            </Grid>
        </Box>
    )
}
