import { makeStyles } from "@material-ui/core"
import { Motel } from "models"
import { MotelRecommended } from "./MotelRecommended"

interface Props {
    listMotel: Motel[]
}

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 15,
    },
})

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
