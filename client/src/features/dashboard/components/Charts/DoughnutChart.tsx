import { Box, makeStyles, Theme } from '@material-ui/core';
import { Doughnut } from 'react-chartjs-2'

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: 400,
        padding: theme.spacing(2, 0)
    }
}))

export const DoughnutChart = (props: Props) => {
    const classes = useStyles()

    const data = {
        labels: ['Tìm nhà trọ', 'Tìm bạn ở ghép', 'Đánh giá nhà trọ'],
        datasets: [
            {
                label: "Tổng số bài viết đã đăng",
                data: [33, 53, 85],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)'
                ],
            },
        ]
    };

    return (
        <Box className={classes.root}>
            <Doughnut data={data} />
        </Box>
    )
}
