import { Box, Theme } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { makeStyles } from "@material-ui/styles"
import { Post } from "./Post"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0, 3),
    }
}))

export const ListPost = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <ul className="wrapper">
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </ul>

            <Box
                display='flex'
                justifyContent='center'
            >
                <Pagination
                    count={10}
                    color='primary'
                />
            </Box>
        </Box>
    )
}
