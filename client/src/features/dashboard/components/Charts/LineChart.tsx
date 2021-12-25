import { Paper, Theme, makeStyles, Typography } from '@material-ui/core'
import { Line } from 'react-chartjs-2';

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2),
        boxShadow: theme.shadows[3],

        '& > .title': {
            textAlign: 'center',
            fontSize: '1.7rem',
            marginBottom: theme.spacing(3)
        }
    }
}))

const labels = (() => {
    return new Array(12).fill(1).map((_, idx) => `Tháng ${idx + 1}`)
})()

export const LineChart = (props: Props) => {
    const classes = useStyles()

    const data = {
        labels,
        datasets: [
            {
                label: "Tổng số bài viết đã đăng",
                data: [33, 53, 85, 41, 44, 65, 100, 250, 12, 23, 12, 44],
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "#2196f3"
            },
            {
                label: "Tổng số nhà trọ đã đăng",
                data: [133, 153, 185, 441, 144, 265, 300, 250, 112, 213, 12, 344],
                fill: true,
                backgroundColor: "rgba(255,200,87,0.2)",
                borderColor: "#FFC857"
            },
            {
                label: "Tổng số tài khoản đã đăng ký",
                data: [13, 253, 385, 41, 194, 205, 100, 150, 114, 313, 132, 344],
                fill: true,
                backgroundColor: "rgba(187,134,252,0.2)",
                borderColor: "#bb86fc"
            },
        ]
    };

    return (
        <Paper className={classes.root}>
            <Typography className='title' variant='h4'>
                Dữ liệu trong từng tháng trong năm 2021
            </Typography>

            <Line data={data} />
        </Paper>
    )
}
