import { Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { Notify } from "models"
import { memo } from "react"
import { NotificationItem } from "./NotificationItem"

interface Props {
    listNotify: Notify[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0, 1.5),

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1.5, 0)
        }
    }
}))

export const ListNotification = memo(({ listNotify }: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {listNotify.map(notify => (
                <NotificationItem
                    key={notify._id}
                    data={notify}
                />
            ))}
        </ul>
    )
})
