import { Box, Grid, makeStyles, Theme } from "@material-ui/core"
import { ApproveItem } from "."
import AddNewContent from "./common/AddRowContent"
import ApproveLayout from "./layouts/ApproveLayout"
import TableRoom from "./TableRoom"

interface Props {

}

const useStyels = makeStyles((theme: Theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr'
    }
}))

export const ApproveMotelSection = (props: Props) => {
    const classes = useStyels()

    return (
        <ApproveLayout label='Nhà trọ chờ duyệt'>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <ApproveItem>
                        <Box>
                            <AddNewContent />
                            <AddNewContent />
                            <AddNewContent />
                            <AddNewContent />

                            <TableRoom />
                        </Box>
                    </ApproveItem>
                </Grid>

                <Grid item xs={6}>
                    <ApproveItem>
                        <Box>
                            <AddNewContent />
                        </Box>
                    </ApproveItem>
                </Grid>
            </Grid>
        </ApproveLayout>
    )
}
