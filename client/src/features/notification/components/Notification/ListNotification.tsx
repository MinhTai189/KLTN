import { Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useAppSelector } from "app/hooks"
import { selectDataNotify } from "features/notification/notifySlice"
import { memo } from "react"
import { NotificationItem } from "./NotificationItem"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0, 1.5),

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1.5, 0)
        }
    }
}))

export const ListNotification = memo(() => {
    const classes = useStyles()
    const notifyData = useAppSelector(selectDataNotify)

    return (
        <ul className={classes.root}>
            {notifyData && notifyData.notify.map(notify => (
                <NotificationItem
                    key={notify._id}
                    data={notify}
                />
            ))}
        </ul>
    )
})
