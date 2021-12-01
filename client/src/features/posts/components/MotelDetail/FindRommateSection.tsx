import { Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}))

export const FindRommateSection = (props: Props) => {
    const classes = useStyles()

    return (
        <Paper
            className={classes.root}
            component='section'
        >
            <Typography
                className='title'
                variant='h3'
            >
                Tìm bạn ở ghép
            </Typography>

            <ul className="list-post">
                {new Array(4).fill(3).map((_, index) => (
                    <li key={index}>

                    </li>
                ))}
            </ul>
        </Paper>
    )
}
