import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .text': {
            fontSize: '1.3em',
            fontWeight: 300,
            lineHeight: 1.6
        }
    }
}))

export const Content = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root}>
            <Typography className='text'>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis, eius. serunt quia pariatur ducimus dolorum corrupti praesentium, neque atque quam molestias.
                Dolores maiores ipsum laborum necessitatibus consequuntur qui amet quaerat veniam cumque tempore voluptatem sunt eveniet recusandae repudiandae reprehenderit id placeat dolor explicabo, in consectetur fugiat, perferendis temporibus quidem illum. Veniam!
            </Typography>
        </Box>
    )
}
