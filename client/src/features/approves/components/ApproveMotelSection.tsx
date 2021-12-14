import { Box, Grid } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import ModalUp from "components/Common/ModalUp"
import { useState } from "react"
import { ApproveItem } from "."
import ComparingBody from "./common/ComparingBody"
import ApproveLayout from "./layouts/ApproveLayout"
import AddBodyMotel from "./Motels/AddBodyMotel"
import AddBodyPost from "./Posts/AddBodyPost"
import PreviewingBody from "./Posts/PreviewingBody"
import AddBodyRate from "./Rates/AddBodyRate"
import BodyReport from "./Reports/BodyReport"


interface Props {

}

export const ApproveMotelSection = (props: Props) => {
    const [open, setOpen] = useState('')
    const [showAccordion, setShowAccordion] = useState('')

    const handleShowAccordion = (panel: string) => {
        setShowAccordion(prev => prev === panel ? '' : panel)
    }

    return (
        <>
            <ApproveLayout
                label='Nhà trọ chờ duyệt'
                isExpand={showAccordion === 'motel'}
                onClose={() => handleShowAccordion('motel')}
            >
                <Box display='flex' justifyContent='flex-end' my={2}>
                    <Pagination
                        count={5}
                        variant='outlined'
                        shape="rounded"
                        size='small'
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ApproveItem type="Thêm mới">
                            <AddBodyMotel />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem
                            isUpdate
                            type='Chỉnh sửa'
                            openCompareModal={() => setOpen('update')}
                        >
                            <AddBodyMotel />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem type='Thêm mới'>
                            <AddBodyMotel />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem
                            isUpdate
                            type='Chỉnh sửa'
                            openCompareModal={() => setOpen('update')}
                        >
                            <AddBodyMotel />
                        </ApproveItem>
                    </Grid>
                </Grid>
            </ApproveLayout>

            <ApproveLayout
                label='Bài đăng chờ duyệt'
                isExpand={showAccordion === 'post'}
                onClose={() => handleShowAccordion('post')}
            >
                <Box display='flex' justifyContent='flex-end' my={2}>
                    <Pagination
                        count={5}
                        variant='outlined'
                        shape="rounded"
                        size='small'
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ApproveItem
                            type="Review"
                            isReview
                            openPreviewModal={() => setOpen('review')}
                        >
                            <AddBodyPost />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem
                            type='Tìm bạn ở ghép'
                        >
                            <AddBodyPost />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem type='Tìm nhà trọ'>
                            <AddBodyPost />
                        </ApproveItem>
                    </Grid>
                </Grid>
            </ApproveLayout>

            <ApproveLayout
                label='Đánh giá nhà trọ chờ duyệt'
                isExpand={showAccordion === 'rate'}
                onClose={() => handleShowAccordion('rate')}
            >
                <Box display='flex' justifyContent='flex-end' my={2}>
                    <Pagination
                        count={5}
                        variant='outlined'
                        shape="rounded"
                        size='small'
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ApproveItem
                            type="Đánh giá nhà trọ"
                            openPreviewModal={() => setOpen('rate')}
                        >
                            <AddBodyRate />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem
                            type="Đánh giá nhà trọ"
                            openPreviewModal={() => setOpen('rate')}
                        >
                            <AddBodyRate />
                        </ApproveItem>
                    </Grid>
                </Grid>
            </ApproveLayout>

            <ApproveLayout
                label='Báo cáo nội dung xấu'
                isExpand={showAccordion === 'report'}
                onClose={() => handleShowAccordion('report')}
            >
                <Box display='flex' justifyContent='flex-end' my={2}>
                    <Pagination
                        count={5}
                        variant='outlined'
                        shape="rounded"
                        size='small'
                    />
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <ApproveItem
                            isReport
                            type="Báo cáo nhà trọ"
                            openPreviewModal={() => setOpen('report')}
                        >
                            <BodyReport />
                        </ApproveItem>
                    </Grid>

                    <Grid item xs={6}>
                        <ApproveItem
                            isReport
                            type="Báo cáo bình luận"
                            openPreviewModal={() => setOpen('report')}
                        >
                            <BodyReport />
                        </ApproveItem>
                    </Grid>
                </Grid>
            </ApproveLayout>

            <ModalUp open={open === 'update'} onClose={() => setOpen('')}>
                <ComparingBody />
            </ModalUp>

            <ModalUp open={open === 'review'} onClose={() => setOpen('')}>
                <PreviewingBody />
            </ModalUp>
        </>
    )
}
