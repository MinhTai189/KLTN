import { Box, LinearProgress } from "@material-ui/core"
import { useAppDispatch, useAppSelector } from "app/hooks"
import { Filter, User, UserDataTable, UserUpdate } from "models"
import { useEffect, useState } from "react"
import { FormUpdate, Operation, UserTable } from "../components"
import { selectData, selectFilter, selectLoading, userActions } from "../usersSlice"

const UserListPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilter)

    const loading = useAppSelector(selectLoading)
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [userUpdating, setUserUpdating] = useState<UserUpdate>();

    useEffect(() => {
        dispatch(userActions.getUser(filter))
    }, [filter, dispatch])

    const handleUpdateForm = async (data: UserDataTable) => {
        const temp = {
            ...data,
            isAdmin: data.isAdmin === 'admin' ? true : false,
        }

        dispatch(userActions.updateUser(temp))
    }

    const handleRemove = (record: UserDataTable) => {
        dispatch(userActions.removeUser(record.key))
    }

    const handleSearch = (value: Filter) => {
        dispatch(userActions.searchWithDebounce(value))
    }

    const handleFilter = (e: any, key: string) => {
        let newFilter = {};

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

        if (key === '_role' || key === "_school" || key === '_district' || key === '_province') {
            newFilter = {
                ...filter,
                ...newFilter,
                [key]: e
            }
        }

        dispatch(userActions.setFilter(newFilter))
    }

    const handleClearFilter = () => {
        dispatch(userActions.setFilter({
            _page: 1,
            _limit: 15,
        }))
    }

    return (
        <Box>
            {loading && <LinearProgress />}

            <Box padding={2}>
                <Box mb={2}>
                    <Operation handleSearch={handleSearch} handleFilter={handleFilter} handleClearFilter={handleClearFilter} />
                </Box>


                <UserTable
                    setShowUpdateForm={setShowUpdateForm}
                    setUserUpdating={setUserUpdating}
                    handleRemove={handleRemove}
                />

                {userUpdating &&
                    <FormUpdate
                        key={userUpdating.key}
                        showUpdateForm={showUpdateForm}
                        setShowUpdateForm={setShowUpdateForm}
                        onSubmit={handleUpdateForm}
                        userUpdating={userUpdating}
                    />}
            </Box>
        </Box>
    )
}

export default UserListPage
