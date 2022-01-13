import { Box, Grid, Paper, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import {
    ArcElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
    Tooltip
} from 'chart.js';
import { SOCKET_EVENT } from 'constant/constant';
import { DoughnutChart, LineChart, ListSider, RecentActivities, Statistics } from 'features/dashboard/components';
import { dashboardActions, selectDataDashboard } from 'features/dashboard/dashboardSlice';
import { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { socketClient } from 'utils';

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
    const socket = useRef<Socket>()

    const dispatch = useAppDispatch()
    const dashboardData = useAppSelector(selectDataDashboard)

    useEffect(() => {
        socket.current = socketClient

        const listenerMotel = (data: any) => {
            dispatch(dashboardActions.setRecentMotel(data))
        }

        const listenerActivities = (data: any) => {
            dispatch(dashboardActions.setRecentActivities(data))
        }

        const listenerStatistics = (data: any) => {
            dispatch(dashboardActions.setStatistic(data))
        }

        socket.current.on(SOCKET_EVENT.motelActivities, listenerMotel)
        socket.current.on(SOCKET_EVENT.activities, listenerActivities)
        socket.current.on(SOCKET_EVENT.motelActivities, listenerStatistics)

        dispatch(dashboardActions.getData())

        return () => {
            socket.current?.off(SOCKET_EVENT.motelActivities, listenerMotel)
            socket.current?.off(SOCKET_EVENT.activities, listenerActivities)
            socket.current?.off(SOCKET_EVENT.motelActivities, listenerStatistics)
        }
    }, [dispatch])

    return (
        <Box className={classes.root}>
            {dashboardData.statistics && <Statistics data={dashboardData.statistics} />}

            <Box my={4}>
                <Grid container spacing={2}>
                    <Grid item lg={10}>
                        <RecentActivities />

                        <Paper className='chart-wrapper'>
                            <DoughnutChart ratioPost={dashboardData.doughnut.ratioPost} />

                            <DoughnutChart size={dashboardData.doughnut.size} />
                        </Paper>
                    </Grid>

                    <Grid item lg={2}>
                        <ListSider />
                    </Grid>
                </Grid>

                <Box my={2}>
                    <LineChart data={dashboardData.chart} />
                </Box>
            </Box>
        </Box>
    )
}

export default DashboardPage
