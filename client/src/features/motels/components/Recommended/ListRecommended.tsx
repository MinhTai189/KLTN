import { makeStyles } from "@material-ui/core"
import { MotelRecommended } from "./MotelRecommended"

interface Props {

}

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 15,
    },
})

export const ListRecommended = (props: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {new Array(4).fill(10).map((item, index) => (
                <MotelRecommended />
            ))}
        </ul>
    )
}
