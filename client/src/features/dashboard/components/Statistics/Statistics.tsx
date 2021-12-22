import { Box, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import StatisticCard from "./StatisticCard"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px ,1fr))',
        gap: 20
    }
}))

export const Statistics = (props: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root} component='section'>
            <StatisticCard />
            <StatisticCard />
            <StatisticCard />
            <StatisticCard />
            <StatisticCard />
        </Box>
    )
}
