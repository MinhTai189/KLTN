import { Box, Grid } from "@material-ui/core"
import { Pagination } from "@material-ui/lab"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { LoadingAdmin } from "components/Common"
import ModalUp from "components/Common/ModalUp"
import ApproveContext, { initialApproveContext, OpenModalApprove } from "contexts/ApproveContext"
import { useState } from "react"
import { ApproveItem } from "."
import { motelApproveActions, selectDataMotelApprove, selectLoadingMotelApprove, selectPaginationMotelApprove } from "../motelApprove"
import { postApproveActions, selectDataPostApprove, selectLoadingPostApprove, selectPaginationPostApprove } from "../postApprove"
import { rateApproveActions, selectDataRateApprove, selectLoadingRateApprove, selectPaginationRateApprove } from "../rateApprove"
import { reportApproveActions, selectDataReportApprove, selectLoadingReportApprove, selectPaginationReportApprove } from "../reportApprove"
import ComparingBody from "./common/ComparingBody"
import ApproveLayout from "./layouts/ApproveLayout"
import AddBodyMotel from "./Motels/AddBodyMotel"
import AddBodyPost from "./Posts/AddBodyPost"
import PreviewingBody from "./Posts/PreviewingBody"
import AddBodyRate from "./Rates/AddBodyRate"
import BodyReport from "./Reports/BodyReport"

export const ApproveSection = () => {
    const dispatch = useAppDispatch()

    const dataMotelApprove = useAppSelector(selectDataMotelApprove)
    const loadingMotelApprove = useAppSelector(selectLoadingMotelApprove)
    const paginationMotelApprove = useAppSelector(selectPaginationMotelApprove)

    const dataPostApprove = useAppSelector(selectDataPostApprove)
    const loadingPostApprove = useAppSelector(selectLoadingPostApprove)
    const paginationPostApprove = useAppSelector(selectPaginationPostApprove)

    const dataRateApprove = useAppSelector(selectDataRateApprove)
    const loadingRateApprove = useAppSelector(selectLoadingRateApprove)
    const paginationRateApprove = useAppSelector(selectPaginationRateApprove)

    const dataReportApprove = useAppSelector(selectDataReportApprove)
    const loadingReportApprove = useAppSelector(selectLoadingReportApprove)
    const paginationReportApprove = useAppSelector(selectPaginationReportApprove)

    const [dataPreviewModal, setDataPreviewModal] = useState({
        title: '',
        content: ''
    })
    const [open, setOpen] = useState<OpenModalApprove>(initialApproveContext)
    const [showAccordion, setShowAccordion] = useState('')

    const handleShowAccordion = (panel: string) => {
        setShowAccordion(prev => prev === panel ? '' : panel)
    }

    const actionApprovalMotel = {
        handlePagination(e: any, page: number) {
            dispatch(motelApproveActions.setFilter({
                _page: page,
            }))
        },
        handleApprove(motelId: string) {
            dispatch(motelApproveActions.approve(motelId))
        },
        handleRefuse(motelId: string, type: string) {
            dispatch(motelApproveActions.refuse({
                motelId,
                type
            }))
        }
    }

    const actionApprovalPost = {
        handlePagination(e: any, page: number) {
            dispatch(postApproveActions.setFilter({
                _page: page,
            }))
        },
        handleApprove(postId: string) {
            dispatch(postApproveActions.approve(postId))
        },
        handleRefuse(postId: string) {
            dispatch(postApproveActions.refuse(postId))
        }
    }

    const actionApprovalRate = {
        handlePagination(e: any, page: number) {
            dispatch(rateApproveActions.setFilter({
                _page: page,
            }))
        },
        handleApprove(rateId: string) {
            dispatch(rateApproveActions.approve(rateId))
        },
        handleRefuse(rateId: string, motelId: string) {
            dispatch(rateApproveActions.refuse({
                rateId,
                motelId
            }))
        }
    }

    const actionApprovalReport = {
        handlePagination(e: any, page: number) {
            dispatch(reportApproveActions.setFilter({
                _page: page,
            }))
        },
        handleApprove(reportId: string) {
            dispatch(reportApproveActions.approve(reportId))
        },
        handleRefuse(reportId: string) {
            dispatch(reportApproveActions.refuse(reportId))
        }
    }

    return (
        <>
            <ApproveContext.Provider value={{
                openModalApprove: open,
                setOpenModalApprove: setOpen
            }}>
                <ApproveLayout
                    label='Nhà trọ chờ duyệt'
                    quantity={paginationMotelApprove._totalRows}
                    isExpand={showAccordion === 'motel'}
                    onClose={() => handleShowAccordion('motel')}
                >
                    {loadingMotelApprove ? <LoadingAdmin />
                        : <>
                            <Box display='flex' justifyContent='flex-end' my={2}>
                                <Pagination
                                    count={Math.ceil(paginationMotelApprove._totalRows / paginationMotelApprove._limit)}
                                    page={paginationMotelApprove._page}
                                    onChange={actionApprovalMotel.handlePagination}
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
                                                onApprove={() => actionApprovalMotel.handleApprove(data._id)}
                                                onRefuse={() => actionApprovalMotel.handleRefuse(data._id, data.type)}
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

                <ApproveLayout
                    label='Bài đăng chờ duyệt'
                    quantity={paginationPostApprove._totalRows}
                    isExpand={showAccordion === 'post'}
                    onClose={() => handleShowAccordion('post')}
                >
                    {loadingPostApprove ? <LoadingAdmin />
                        : <>
                            <Box display='flex' justifyContent='flex-end' my={2}>
                                <Pagination
                                    count={Math.ceil(paginationPostApprove._totalRows / paginationPostApprove._limit)}
                                    page={paginationPostApprove._page}
                                    onChange={actionApprovalPost.handlePagination}
                                    variant='outlined'
                                    shape="rounded"
                                    size='small'
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {dataPostApprove && dataPostApprove.map(post => {
                                    return (
                                        <Grid key={post._id} item xs={6}>
                                            <ApproveItem
                                                type={post.subject.name}
                                                isReview={post.type === 3}
                                                modalId={post._id}
                                                user={post.owner}
                                                createdAt={post.createdAt}
                                                title={post.title}
                                                content={post.content}
                                                setDataPreviewModal={setDataPreviewModal}
                                                onApprove={() => actionApprovalPost.handleApprove(post._id)}
                                                onRefuse={() => actionApprovalPost.handleRefuse(post._id)}
                                            >
                                                <AddBodyPost data={post} />
                                            </ApproveItem>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </>}
                </ApproveLayout>


                <ApproveLayout
                    label='Đánh giá nhà trọ chờ duyệt'
                    quantity={paginationRateApprove._totalRows}
                    isExpand={showAccordion === 'rate'}
                    onClose={() => handleShowAccordion('rate')}
                >
                    {loadingRateApprove ? <LoadingAdmin />
                        : <>
                            <Box display='flex' justifyContent='flex-end' my={2}>
                                <Pagination
                                    count={Math.ceil(paginationRateApprove._totalRows / paginationRateApprove._limit)}
                                    page={paginationRateApprove._page}
                                    onChange={actionApprovalRate.handlePagination}
                                    variant='outlined'
                                    shape="rounded"
                                    size='small'
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {dataRateApprove && dataRateApprove.map(rate => (
                                    <Grid key={rate._id} item xs={6}>
                                        <ApproveItem
                                            type="Đánh giá nhà trọ"
                                            user={rate.owner}
                                            createdAt={rate.createAt}
                                            onApprove={() => actionApprovalRate.handleApprove(rate._id)}
                                            onRefuse={() => actionApprovalRate.handleRefuse(rate._id, rate.motel._id)}
                                        >
                                            <AddBodyRate rate={rate} />
                                        </ApproveItem>
                                    </Grid>
                                ))}
                            </Grid>
                        </>}
                </ApproveLayout>


                <ApproveLayout
                    label='Báo cáo nội dung xấu'
                    quantity={paginationReportApprove._totalRows}
                    isExpand={showAccordion === 'report'}
                    onClose={() => handleShowAccordion('report')}
                >
                    {loadingReportApprove ? <LoadingAdmin />
                        : <>
                            <Box display='flex' justifyContent='flex-end' my={2}>
                                <Pagination
                                    count={Math.ceil(paginationReportApprove._totalRows / paginationReportApprove._limit)}
                                    page={paginationReportApprove._page}
                                    onChange={actionApprovalReport.handlePagination}
                                    variant='outlined'
                                    shape="rounded"
                                    size='small'
                                />
                            </Box>

                            <Grid container spacing={2}>
                                {dataReportApprove && dataReportApprove.map(report => {
                                    const listType = {
                                        rate: 'Báo cáo đánh giá',
                                        post: 'Báo cáo bài viết',
                                        comment: 'Báo cáo bình luận'
                                    }

                                    return (
                                        <Grid key={report._id} item xs={6}>
                                            <ApproveItem
                                                // @ts-ignore
                                                type={listType[report.type]}
                                                user={report.owner}
                                                createdAt={report.createdAt}
                                                onApprove={() => actionApprovalReport.handleApprove(report._id)}
                                                onRefuse={() => actionApprovalReport.handleRefuse(report._id)}
                                            >
                                                <BodyReport data={report} />
                                            </ApproveItem>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </>}
                </ApproveLayout>
            </ApproveContext.Provider>

            {open.type === 'update' && <ModalUp
                open={open.type === 'update'}
                onClose={() => setOpen(initialApproveContext)}
            >
                <ComparingBody motelId={open.id} />
            </ModalUp>}

            {open.type === 'review' && <ModalUp
                open={open.type === 'review'}
                onClose={() => setOpen(initialApproveContext)}
            >
                <PreviewingBody
                    data={dataPreviewModal}
                />
            </ModalUp>}
        </>
    )
}
