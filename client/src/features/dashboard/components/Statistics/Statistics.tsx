import { Box, Theme } from "@material-ui/core"
import { Folder, Hearing, Home, People, Queue } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import { Statistic } from "models"
import StatisticCard from "./StatisticCard"

interface Props {
    data: Statistic
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px ,1fr))',
        gap: 20
    }
}))

const listLabelIcon = {
    account: {
        icon: <People />,
        label: 'Tài khoản'
    },
    motel: {
        icon: <Home />,
        label: 'Nhà trọ'
    },
    approval: {
        icon: <Queue />,
        label: 'Chờ duyệt'
    },
    access: {
        icon: <Hearing />,
        label: 'Truy cập'
    },
    post: {
        icon: <Folder />,
        label: 'Bài viết'
    },
}

export const Statistics = ({ data }: Props) => {
    const classes = useStyles()

    return (
        <Box className={classes.root} component='section'>
            {Object.entries(data).map(([key, value]) => {
                //@ts-ignore
                const { icon, label } = listLabelIcon[key]

                return (
                    <StatisticCard
                        key={key}
                        icon={icon}
                        label={label}
                        quantity={value}
                    />
                )
            })}
        </Box>
    )
}
