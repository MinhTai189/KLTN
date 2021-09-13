import { LockFilled } from "@ant-design/icons"
import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { MotelDataTable } from "models"
import { useEffect } from "react"
import { MotelTable } from "../components"
import { motelActions, selectFilterMotel, selectLoadingMotel } from "../motelSlice"

const MotelListPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterMotel)
    const loading = useAppSelector(selectLoadingMotel)

    useEffect(() => {
        dispatch(motelActions.getMotel(filter))
    }, [dispatch, filter])

    const handleRemove = (record: MotelDataTable) => {
        console.log(record);
    }

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                {/* <Box mb={2}>
                    <Operation handleSearch={handleSearch} handleFilter={handleFilter} handleClearFilter={handleClearFilter} />
                </Box> */}


                <MotelTable
                    // setShowUpdateForm={setShowUpdateForm}
                    // setUserUpdating={setUserUpdating}
                    handleRemove={handleRemove}
                />
            </Box>
        </Box>
    )
}

export default MotelListPage
