import { Box, Grid, Paper, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { DoughnutChart, LineChart, ListSider, RecentActivities, Statistics } from 'features/dashboard/components'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

interface Props {

}

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1.5),

        '& .chart-wrapper': {
            display: 'flex',
            justifyContent: 'space-around',
            boxShadow: theme.shadows[3],
            marginTop: theme.spacing(2)
        }
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

                        <Paper className='chart-wrapper'>
                            <DoughnutChart />

                            <DoughnutChart />
                        </Paper>
                    </Grid>

                    <Grid item lg={2}>
                        <ListSider />
                    </Grid>
                </Grid>

                <Box my={2}>
                    <LineChart />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage
