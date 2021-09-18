import { LockFilled } from "@ant-design/icons"
import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { MotelDataTable, Filter } from "models"
import { useEffect } from "react"
import { MotelTable, Operation } from "../components"
import { motelActions, selectFilterMotel, selectLoadingMotel } from "../motelSlice"

const MotelListPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterMotel)
    const loading = useAppSelector(selectLoadingMotel)

    useEffect(() => {
        dispatch(motelActions.getMotel(filter))
    }, [dispatch, filter])

    const handleSearch = (filter: Filter) => {
        dispatch(motelActions.searchWithDebounce(filter))
    }

    const handleFilter = (e: any, key: string) => {
        let newFilter = {}

        if (key === '_sort') {
            if (e) {
                const [_sort, _order] = e.split('.')

                newFilter = {
                    ...filter,
                    _sort,
                    _order
                }
            } else {
                newFilter = {
                    ...filter,
                    _sort: e,
                    _order: e
                }
            }
        }

        if (key === '_status') {
            newFilter = {
                ...filter,
                [key]: e
            }
        }

        dispatch(motelActions.setFilter(newFilter))
    }

    const handleRemove = (record: MotelDataTable) => {
        console.log(record);
    }

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    <Operation handleSearch={handleSearch} handleFilter={handleFilter} />
                </Box>


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
