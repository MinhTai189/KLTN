import { Box, makeStyles, Theme } from '@material-ui/core';
import { RatioPost, Size } from 'models';
import { memo, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';

interface Props {
    size?: Size
    ratioPost?: RatioPost[]
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 400,
        padding: theme.spacing(2, 0)
    }
}))

export const DoughnutChart = memo(({ size, ratioPost }: Props) => {
    const classes = useStyles()

    const data = useMemo(() => {
        if (!size && !ratioPost) return

        let labels: string[] = []
        let data: number[] = []
        let backgroundColor: string[] = []

        if (size) {
            labels = ['Dung lượng đã dùng(MB)', 'Dung lượng trống(MB)']
            data = [size.dataSize, size.totalSize - size.dataSize]
            backgroundColor = [
                'rgb(255, 99, 132)',
                'rgb(83, 83, 83)',
            ]
        }

        if (ratioPost) {
            ratioPost.forEach(x => {
                labels.push(x.name)
                data.push(x.quantity)
            })
            backgroundColor = [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ]
        }

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor
                },
            ]
        };
    }, [size, ratioPost])

    return (
        <Box className={classes.root}>
            {data && <Doughnut data={data} />}
        </Box>
    )
})
