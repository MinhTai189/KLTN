import { Box, Grid, Paper, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { MainLayout } from "components/Layouts"
import { ListNotification } from "features/notification/components"
import Controls from "features/notification/components/Notification/Controls"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(12)
    }
}))

const NotificationPage = (props: Props) => {
    const classes = useStyles()

    return (
        <MainLayout>
            <Box className={`${classes.root} container`}>
                <Grid container spacing={2}>
                    <Grid item lg={1} />
                    <Grid item lg={3}>
                        <Controls />
                    </Grid>
                    <Grid item lg={5}>
                        <ListNotification />
                    </Grid>
                    <Grid item lg={3} />
                </Grid>
            </Box>
        </MainLayout>
    )
}

export default NotificationPage
