import { useAppSelector } from "app/hooks"
import { selectDataDashboard } from "features/dashboard/dashboardSlice"
import RecentActivitiesLayout from "../Layouts/RecentActivitiesLayout"
import RecentActivitiesTable from "./RecentActivitiesTable"

const RecentActivity = () => {
    const dashboardData = useAppSelector(selectDataDashboard)

    return (
        <RecentActivitiesLayout label='Hoạt động gần đây'>
            <RecentActivitiesTable data={dashboardData.recents.activities} />
        </RecentActivitiesLayout>
    )
}

export default RecentActivity