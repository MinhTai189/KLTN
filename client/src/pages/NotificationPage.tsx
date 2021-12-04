import { Box, Grid, Paper, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { MainLayout } from "components/Layouts"
import { ListNotification } from "features/notification/components"
import Controls from "features/notification/components/Notification/Controls"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(12),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(10),
        },
    }
}))

const NotificationPage = (props: Props) => {
    const classes = useStyles()

    return (
        <MainLayout>
            <Box className={`${classes.root} container`}>
                <Grid container>
                    <Grid item sm={undefined} md={undefined} lg={1} />
                    <Grid item xs={12} sm={4} md={4} lg={3}>
                        <Controls />
                    </Grid>
                    <Grid item xs={12} sm={8} md={8} lg={6}>
                        <ListNotification />
                    </Grid>
                    <Grid item sm={undefined} md={undefined} lg={2} />
                </Grid>
            </Box>
        </MainLayout>
    )
}

export default NotificationPage
