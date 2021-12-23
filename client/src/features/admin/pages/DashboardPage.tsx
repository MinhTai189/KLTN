import { Box, Grid, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ListSider, RecentActivities, Statistics } from 'features/dashboard/components'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1.5)
    }
}))

const DashboardPage = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Statistics />

            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item lg={10}>
                        <RecentActivities />
                    </Grid>

                    <Grid item lg={2}>
                        <ListSider />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default DashboardPage
