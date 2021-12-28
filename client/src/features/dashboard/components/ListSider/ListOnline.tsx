import { useAppSelector } from "app/hooks"
import { selectDataDashboard } from "features/dashboard/dashboardSlice"
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer"
import ListRow from './ListRow'
import { Box } from "@material-ui/core";

interface Props {

}

const ListOnline = (props: Props) => {
    const dashboardData: any = useAppSelector(selectDataDashboard)

    const Row = (({ index, style }: { index: number; style: any }) => (
        <ListRow style={style} user={dashboardData.list.onlines[index]} isOnline />
    ))

    return (
        <Box style={{
            width: '100%',
            height: '100%',
        }}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={dashboardData.list.onlines.length}
                        itemSize={40}
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

export default ListOnline
