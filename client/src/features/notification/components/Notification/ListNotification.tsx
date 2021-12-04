import { Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { NotificationItem } from "./NotificationItem"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0, 1.5),

        [theme.breakpoints.down('xs')]: {
            padding: theme.spacing(1.5, 0)
        }
    }
}))

export const ListNotification = (props: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {new Array(10).fill(1).map((_, index) => (
                <NotificationItem
                    key={index}
                    isUnread={index < 4}
                />
            ))}
        </ul>
    )
}
