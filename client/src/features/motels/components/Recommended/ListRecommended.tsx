import { makeStyles, Theme } from "@material-ui/core"
import { Motel } from "models"
import { MotelRecommended } from "./MotelRecommended"

interface Props {
    listMotel: Motel[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
        gap: 15,

        [theme.breakpoints.down('xs')]: {
            gap: 8
        }
    },
}))

export const ListRecommended = ({ listMotel }: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {listMotel.map(motel => (
                <MotelRecommended key={motel._id} motelData={motel} />
            ))}
        </ul>
    )
}
