import { Box, makeStyles } from "@material-ui/core"
import { MotelRecommended } from "./MotelRecommended"
import Carousel from 'react-elastic-carousel'

interface Props {

}

const useStyles = makeStyles({
    root: {
        display: 'flex',

        '& > .items': {
        }
    },
})

export const ListRecommended = (props: Props) => {
    const classes = useStyles()

    return (
        <Carousel
            className={classes.root}
            itemsToShow={3}
            isRTL={false}
            showArrows={false}
            pagination={false}
        >
            {new Array(5).fill(10).map((item, index) => (
                <Box
                    key={index}
                    className='items'
                >
                    <MotelRecommended />
                </Box>
            ))}
        </Carousel>
    )
}
