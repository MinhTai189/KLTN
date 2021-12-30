import { makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import { Charts } from 'features/dashboard/dashboardSlice';
import { Chart } from 'models';
import { memo, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

interface Props {
    data: Charts
}

interface Columns {
    year: number
    month: number
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

const calcMaxYearMonth = (data: Charts) => {
    let maxYear = 0
    let maxMonth = 1

    Object.entries(data).forEach(([key, value]) => {
        value.forEach((x: Chart) => {
            const { year, month } = x.createdAt

            maxYear = year > maxYear ? year : maxYear
            maxMonth = month > maxMonth && year === maxYear ? month : maxMonth
        })
    })

    return { maxYear, maxMonth }
}

const calcColums = (data: Charts) => {
    let { maxMonth, maxYear } = calcMaxYearMonth(data)

    return new Array(12).fill('').map(() => {
        if (--maxMonth <= -1) {
            maxMonth = 11
            maxYear = maxYear - 1
        }

        return {
            year: maxYear,
            month: maxMonth + 1
        }
    }).reverse()
}

// convert original data into data chart
const calcDataLine = (columns: Columns[], charts: Chart[]) => {
    return columns.map(x => {
        const mathMonthYear = charts.find(chart => {
            const { month, year } = chart.createdAt

            return x.month === month && x.year === year
        })

        if (mathMonthYear)
            return mathMonthYear.quantity

        return null
    })
}

export const LineChart = memo(({ data }: Props) => {
    const classes = useStyles()

    const createDataChart = useMemo(() => {
        if (!data) return

        const columns = calcColums(data)
        const labels = columns.map(x => (`Tháng ${x.month} Năm ${x.year}`))
        const registerdAccount = calcDataLine(columns, data.registerdAccount)
        const totalMotelEveryMonth = calcDataLine(columns, data.totalMotelEveryMonth)
        const totalPostEveryMonth = calcDataLine(columns, data.totalPostEveryMonth)

        return {
            labels,
            datasets: [
                {
                    label: "Tổng số bài viết đã đăng",
                    data: totalPostEveryMonth,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "#2196f3"
                },
                {
                    label: "Tổng số nhà trọ đã đăng",
                    data: totalMotelEveryMonth,
                    fill: true,
                    backgroundColor: "rgba(255,200,87,0.2)",
                    borderColor: "#FFC857"
                },
                {
                    label: "Tổng số tài khoản đã đăng ký",
                    data: registerdAccount,
                    fill: true,
                    backgroundColor: "rgba(187,134,252,0.2)",
                    borderColor: "#bb86fc"
                },
            ]
        }
    }, [data])

    return (
        <Paper className={classes.root}>
            <Typography className='title' variant='h4'>
                Dữ liệu trong từng tháng trong năm 2021
            </Typography>

            {createDataChart && <Line data={createDataChart} />}
        </Paper>
    )
})
