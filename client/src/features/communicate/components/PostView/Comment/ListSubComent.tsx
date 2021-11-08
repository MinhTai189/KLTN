import { makeStyles } from "@material-ui/core"
import { Subcomment } from "./Subcomment"

interface Props {

}

const useStyles = makeStyles({
    root: {
        paddingLeft: 16,
        borderLeft: '1px solid #cecece'
    }
})

export const ListSubComment = (props: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {new Array(5).fill(1).map((item, index) => {
                return <li key={index}>
                    <Subcomment />
                </li>
            })}
        </ul>
    )
}
