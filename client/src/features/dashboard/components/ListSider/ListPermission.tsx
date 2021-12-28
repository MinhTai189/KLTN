import { useAppSelector } from "app/hooks"
import { selectDataDashboard } from "features/dashboard/dashboardSlice"
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer"
import ListRow from './ListRow'
import { Box } from "@material-ui/core";

interface Props {

}

const ListPermission = (props: Props) => {
    const dashboardData: any = useAppSelector(selectDataDashboard)

    const Row = (({ index, style }: { index: number; style: any }) => (
        <ListRow style={style} user={dashboardData.list.importants[index]} />
    ))

    return (
        <Box style={{
            width: '100%',
            height: '100%'
        }}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={dashboardData.list.importants.length}
                        itemSize={50}
                        height={height}
                        width={width}
                    >
                        {Row}
                    </List>
                )}
            </AutoSizer>
        </Box>
    )
}

export default ListPermission