import RecentActivitiesLayout from "../Layouts/RecentActivitiesLayout"
import ActivitiesTable from "./ActivitiesTable"

interface Props {

}

const RecentActivity = (props: Props) => {
    return (
        <RecentActivitiesLayout>
            <ActivitiesTable />
        </RecentActivitiesLayout>
    )
}

export default RecentActivity
