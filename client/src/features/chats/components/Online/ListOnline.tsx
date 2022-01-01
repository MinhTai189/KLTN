import { Box } from "@material-ui/core";
import ListRow from "features/dashboard/components/ListSider/ListRow";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

interface Props {

}

const ListOnline = (props: Props) => {
    const Row = (({ index, style }: { index: number; style: any }) => (
        <ListRow style={style} user={{
            name: 'Trần Minh Tài',
            rank: 'Người qua đường',
            _id: '123432',
        } as any} isOnline />
    ))

    return (
        <Box style={{
            width: '100%',
            height: '100%',
        }}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={18}
                        itemSize={60}
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
