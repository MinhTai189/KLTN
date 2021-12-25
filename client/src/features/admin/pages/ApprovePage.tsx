import { Box, makeStyles, Theme } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { ApproveSection } from "features/approves/components"
import { motelApproveActions, selectFilterMotelApprove } from "features/approves/motelApprove"
import { postApproveActions, selectFilterPostApprove } from "features/approves/postApprove"
import { rateApproveActions, selectFilterRateApprove } from "features/approves/rateApprove"
import { reportApproveActions, selectFilterReportApprove } from "features/approves/reportApprove"
import { useEffect } from "react"

interface Props {

}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(2)
    }
}))

const ApprovePage = (props: Props) => {
    const classes = useStyles()
    const dispatch = useAppDispatch()

    const filterMotelApprove = useAppSelector(selectFilterMotelApprove)
    const filterPostApprove = useAppSelector(selectFilterPostApprove)
    const filterRateApprove = useAppSelector(selectFilterRateApprove)
    const filterReportApprove = useAppSelector(selectFilterReportApprove)

    useEffect(() => {
        dispatch(motelApproveActions.get(filterMotelApprove))
    }, [filterMotelApprove])

    useEffect(() => {
        dispatch(postApproveActions.get(filterPostApprove))
    }, [filterPostApprove])

    useEffect(() => {
        dispatch(rateApproveActions.get(filterRateApprove))
    }, [filterRateApprove])

    useEffect(() => {
        dispatch(reportApproveActions.get(filterReportApprove))
    }, [filterReportApprove])

    return (
        <Box className={classes.root}>
            <ApproveSection />
        </Box>
    )
}

export default ApprovePage
