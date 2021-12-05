import { Box, Grid, Paper, Theme } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { useAppSelector } from "app/hooks"
import { MainLayout } from "components/Layouts"
import { selectCurrentUser } from "features/auth/authSlice"
import { ListNotification } from "features/notification/components"
import Controls from "features/notification/components/Notification/Controls"
import { Notify, User } from "models"
import { ChangeEvent, useCallback, useEffect, useState } from "react"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        paddingTop: theme.spacing(12),

        [theme.breakpoints.down('sm')]: {
            paddingTop: theme.spacing(10),
        },
    }
}))

const NotificationPage = (props: Props) => {
    const classes = useStyles()
    const currentUser: User = useAppSelector(selectCurrentUser)

    const [currentData, setCurrentData] = useState<Notify[]>([])
    const [currentIdx, setCurrentIdx] = useState(0)
    const [status, setStatus] = useState({
        read: true,
        unread: true
    })

    const NOTIFY_ONE_PAGE = 10 // 10: one page has ten notifies

    const totalPage = useCallback(() => {
        if (!currentUser) return 1
        return Math.ceil(currentUser.notify!.length / NOTIFY_ONE_PAGE)
    }, [currentUser])

    useEffect(() => {
        if (currentUser) {
            const notifies = currentUser.notify ?? []
            const startIdx = currentIdx * NOTIFY_ONE_PAGE
            const endIdx = (currentIdx + 1) * NOTIFY_ONE_PAGE

            setCurrentData(notifies.slice(startIdx, endIdx))
        }
    }, [currentIdx, currentUser])

    const handlePagination = (e: any, page: number) => {
        setCurrentIdx(page)
    }

    const handleChecked = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(prev => ({ ...prev, [e.target.name]: e.target.checked }))
    }

    return (
        <MainLayout>
            <Box className={`${classes.root} container`}>
                <Grid container>
                    <Grid item sm={undefined} md={undefined} lg={1} />
                    <Grid item xs={12} sm={4} md={4} lg={3}>
                        <Controls
                            totalPage={totalPage()}
                            handlePagination={handlePagination}
                            status={status}
                            setStatus={setStatus}
                            handleChecked={handleChecked}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8} md={8} lg={6}>
                        <ListNotification
                            listNotify={currentData}
                        />
                    </Grid>
                    <Grid item sm={undefined} md={undefined} lg={2} />
                </Grid>
            </Box>
        </MainLayout>
    )
}

export default NotificationPage
