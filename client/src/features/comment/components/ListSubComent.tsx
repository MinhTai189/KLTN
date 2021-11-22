import { makeStyles } from "@material-ui/core"
import { ReplingComment } from "models"
import { Subcomment } from "./Subcomment"

interface Props {
    listReply: ReplingComment[]
}

const useStyles = makeStyles({
    root: {
        paddingLeft: 16,
        borderLeft: '1px solid #cecece'
    }
})

export const ListSubComment = ({ listReply }: Props) => {
    const classes = useStyles()

    return (
        <ul className={classes.root}>
            {listReply && listReply.map(reply => {
                return (<li key={reply._id}>
                    <Subcomment replyData={reply} />
                </li>)
            })}
        </ul>
    )
}
