import { Box } from "@material-ui/core";
import ChatContext from "contexts/ChatContext";
import ListRow from "features/dashboard/components/ListSider/ListRow";
import { useContext } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

interface Props {

}

const ListOnline = (props: Props) => {
    const { activedGroup } = useContext(ChatContext)

    if (!activedGroup) return null

    const Row = (({ index, style }: { index: number; style: any }) => (
        <ListRow style={style} user={activedGroup.ononlines[index]} isOnline />
    ))

    return (
        <Box style={{
            width: '100%',
            height: '100%',
        }}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={activedGroup.ononlines.length}
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
