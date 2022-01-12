import { Box } from "@material-ui/core"
import { Modal } from "antd"
import ChatContext from "contexts/ChatContext"
import { useContext } from "react"
import MemberRow from "./MemberRow"
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

interface Props {
    open: boolean
}

const ListMemberModal = ({ open }: Props) => {
    const { activedGroup, setShowListMember } = useContext(ChatContext)

    if (!activedGroup) return <></>

    const Row = (({ index, style }: { index: number; style: any }) => (
        <MemberRow style={style} member={activedGroup.members[index]} />
    ))

    return (
        <Modal
            visible={open}
            footer={null}
            title={`Danh sách thành viên nhóm:${activedGroup.name}`}
            style={{
                top: 20
            }}
            onCancel={() => setShowListMember(false)}
        >
            <Box style={{
                width: '100%',
                height: 500,
            }}>
                <AutoSizer>
                    {({ width, height }: { width: any, height: any }) => (
                        <List
                            itemCount={activedGroup.members.length}
                            itemSize={60}
                            height={height}
                            width={width}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </Box>
        </Modal>
    )
}

export default ListMemberModal
