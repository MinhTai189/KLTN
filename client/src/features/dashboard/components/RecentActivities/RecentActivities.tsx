import { Box, Grid } from "@material-ui/core"
import RecentActivity from "./RecentActivity"

interface Props {

}

export const RecentActivities = (props: Props) => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item lg={6}>
                    <RecentActivity />
                </Grid>
                <Grid item lg={6}>
                    <RecentActivity />
                </Grid>
            </Grid>
        </Box>
    )
}
