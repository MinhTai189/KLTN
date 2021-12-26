import { useAppSelector } from "app/hooks"
import { selectDataDashboard } from "features/dashboard/dashboardSlice"
import RecentActivitiesLayout from "../Layouts/RecentActivitiesLayout"
import RecentMotelTable from "./RecentMotelTable"

const RecentMotel = () => {
    const dashboardData = useAppSelector(selectDataDashboard)

    return (
        <RecentActivitiesLayout label='Đăng nhà trọ gần đây'>
            <RecentMotelTable data={dashboardData.recents.motels} />
        </RecentActivitiesLayout>
    )
}

export default RecentMotel
