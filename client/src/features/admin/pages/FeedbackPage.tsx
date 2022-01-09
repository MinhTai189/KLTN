import { Box, LinearProgress, makeStyles, Theme } from "@material-ui/core"
import FeedbackTable from "../components/Feedback/FeedbackTable"
import { useState, useEffect } from 'react'
import feedbackApis from 'api/feedback'
import Feedback from 'models/Feedback'
import { toast } from "react-toastify"
import { calculateCreatedTimeHDMY } from "utils/convert-date/calculateCreatedTime"

const useStyles = makeStyles((theme: Theme) => ({
    root: {}
}))

const mapFeedbackToTable = (feedbacks: Feedback[]) => {
    return feedbacks.map((feedback, index) => ({
        key: feedback._id,
        index: index + 1,
        owner: feedback.owner,
        category: feedback.title,
        content: feedback.content,
        date: calculateCreatedTimeHDMY(feedback.createdAt)
    }))
}

const FeedbackPage = () => {
    const classes = useStyles()
    const [feedbackTable, setFeedbackTable] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchFeedback()
    }, [])

    const fetchFeedback = () => {
        setLoading(true)

        feedbackApis.getFeedback()
            .then(res => {
                setFeedbackTable(mapFeedbackToTable(res.data))
                setLoading(false)
            })
            .catch((err: any) => {
                setLoading(false)
                toast.error(err.response.data.message)
            })
    }

    const handleRemoveFeedback = (feedbackId: string) => {
        feedbackApis.removeFeedback(feedbackId)
            .then(fetchFeedback)
            .catch((err: any) => toast.error(err.response.data.message))
    }

    return (
        <Box className={classes.root}>
            {loading && <LinearProgress />}

            <FeedbackTable
                loading={loading}
                dataTable={feedbackTable}
                handleRemoveFeedback={handleRemoveFeedback}
            />
        </Box>
    )
}

export default FeedbackPage
