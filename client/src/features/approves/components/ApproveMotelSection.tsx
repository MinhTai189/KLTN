import { Box, Grid } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { LoadingAdmin } from "components/Common"
import ModalUp from "components/Common/ModalUp"
import ApproveContext, { OpenModalApprove } from "contexts/ApproveContext"
import { useState } from "react"
import { ApproveItem } from "."
import { motelApproveActions, selectDataMotelApprove, selectFilterMotelApprove, selectLoadingMotelApprove, selectPaginationMotelApprove } from "../motelApprove"
import ComparingBody from "./common/ComparingBody"
import ApproveLayout from "./layouts/ApproveLayout"
import AddBodyMotel from "./Motels/AddBodyMotel"


interface Props {

}

export const ApproveMotelSection = (props: Props) => {
    const dispatch = useAppDispatch()

    const dataMotelApprove = useAppSelector(selectDataMotelApprove)
    const loadingMotelApprove = useAppSelector(selectLoadingMotelApprove)
    const paginationMotelApprove = useAppSelector(selectPaginationMotelApprove)
    const filterMotelApprove = useAppSelector(selectFilterMotelApprove)

    const [open, setOpen] = useState<OpenModalApprove>({
        type: '',
        id: ''
    })
    const [showAccordion, setShowAccordion] = useState('')

    const handleShowAccordion = (panel: string) => {
        setShowAccordion(prev => prev === panel ? '' : panel)
    }

    const handlePaginationMotel = (e: any, page: number) => {
        dispatch(motelApproveActions.setFilter({
            ...filterMotelApprove,
            _page: page,
        }))
    }

    return (
        <>
            <ApproveContext.Provider value={{
                openModalApprove: open,
                setOpenModalApprove: setOpen
            }}>
                <ApproveLayout
                    label='Nhà trọ chờ duyệt'
                    isExpand={showAccordion === 'motel'}
                    onClose={() => handleShowAccordion('motel')}
                >
                    {loadingMotelApprove ? <LoadingAdmin />
                        : <>
                            <Box display='flex' justifyContent='flex-end' my={2}>
                                <Pagination
                                    count={Math.ceil(paginationMotelApprove._totalRows / paginationMotelApprove._limit)}
                                    page={paginationMotelApprove._page}
                                    onChange={handlePaginationMotel}
                                    variant='outlined'
                                    shape="rounded"
                                    size='small'
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {dataMotelApprove && dataMotelApprove.map(data => {
                                    const type = data.type === 'update' ? 'Cập nhật' : 'Thêm mới'

                                    return (
                                        <Grid key={data._id} item xs={6}>
                                            <ApproveItem
                                                modalId={data._id}
                                                type={type}
                                                isUpdate={data.type === 'update'}
                                                user={data.owner}
                                                createdAt={data.createdAt}
                                            >
                                                <AddBodyMotel dataMotel={data} />
                                            </ApproveItem>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </>
                    }
                </ApproveLayout>

                {/* <ApproveLayout
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
            </ApproveLayout> */}
            </ApproveContext.Provider>

            {open.type === 'update' &&
                <ModalUp
                    open={open.type === 'update'}
                    onClose={() => setOpen({
                        type: '',
                        id: ''
                    })}
                >
                    <ComparingBody motelId={open.id} />
                </ModalUp>}

            {/* <ModalUp open={valueContext.openModalApprove === 'review'} onClose={() => valueContext.setOpenModalApprove('')}>
                <PreviewingBody />
            </ModalUp> */}
        </>
    )
}
