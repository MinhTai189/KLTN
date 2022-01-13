import { Box, makeStyles, Theme } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { ApproveSection } from "features/approves/components"
import { motelApproveActions, selectFilterMotelApprove } from "features/approves/motelApprove"
import { postApproveActions, selectFilterPostApprove } from "features/approves/postApprove"
import { rateApproveActions, selectFilterRateApprove } from "features/approves/rateApprove"
import { reportApproveActions, selectFilterReportApprove } from "features/approves/reportApprove"
import { useEffect } from "react"

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))

const ApprovePage = () => {
    const classes = useStyles()
    const dispatch = useAppDispatch()

    const filterMotelApprove = useAppSelector(selectFilterMotelApprove)
    const filterPostApprove = useAppSelector(selectFilterPostApprove)
    const filterRateApprove = useAppSelector(selectFilterRateApprove)
    const filterReportApprove = useAppSelector(selectFilterReportApprove)

    useEffect(() => {
        dispatch(motelApproveActions.get(filterMotelApprove))
    }, [filterMotelApprove, dispatch])

    useEffect(() => {
        dispatch(postApproveActions.get(filterPostApprove))
    }, [filterPostApprove, dispatch])

    useEffect(() => {
        dispatch(rateApproveActions.get(filterRateApprove))
    }, [filterRateApprove, dispatch])

    useEffect(() => {
        dispatch(reportApproveActions.get(filterReportApprove))
    }, [filterReportApprove, dispatch])

    return (
        <Box className={classes.root}>
            <ApproveSection />
        </Box>
    )
}

export default ApprovePage
