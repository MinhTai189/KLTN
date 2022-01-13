import { useAppDispatch, useAppSelector } from "app/hooks"
import { dashboardActions, selectDataDashboard } from "features/dashboard/dashboardSlice"
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer"
import ListRow from './ListRow'
import { Box } from "@material-ui/core";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { socketClient } from "utils";
import { SOCKET_EVENT } from "constant/constant";

const ListOnline = () => {
    const socket = useRef<Socket>()
    const dispatch = useAppDispatch()
    const dashboardData: any = useAppSelector(selectDataDashboard)

    const Row = (({ index, style }: { index: number; style: any }) => (
        <ListRow style={style} user={dashboardData.list.onlines[index]} isOnline />
    ))

    useEffect(() => {
        socket.current = socketClient

        const listener = (data: any) => {
            dispatch(dashboardActions.setListOnline(data))
        }

        socket.current.on(SOCKET_EVENT.online, listener)

        return () => {
            socket.current?.off(SOCKET_EVENT.online, listener)
        }
    }, [dispatch])

    return (
        <Box style={{
            width: '100%',
            height: '100%',
        }}>
            <AutoSizer>
                {({ width, height }: { width: any, height: any }) => (
                    <List
                        itemCount={dashboardData.list.onlines.length}
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

export default ListOnline
