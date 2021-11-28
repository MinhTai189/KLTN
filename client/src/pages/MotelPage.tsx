import { Box } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { ListMotelSection } from 'features/motels/components'
import { motelActions, selectFilterMotel } from 'features/motels/motelSlice'
import { schoolActions, selectDataSchool } from 'features/school/schoolSlice'
import { School } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLocation } from 'react-router'


const MotelPage = () => {
    const dispatch = useAppDispatch()
    const location = useLocation<any>()

    const filter = useAppSelector(selectFilterMotel)
    const listSchool = useAppSelector(selectDataSchool)

    const [filterSchool, setFilterSchool] = useState<(string | School)[]>([])

    useEffect(() => {
        dispatch(motelActions.getMotel({
            ...filter,
            _limit: 10,
        }))
    }, [filter])

    useEffect(() => {
        if (listSchool.length === 0)
            dispatch(schoolActions.getSchool())


        if (location.state?.school) {
            setFilterSchool([location.state.school])
            dispatch(motelActions.setFilter({ ...filter, _school: [location.state.school.codeName] }))
        }
        return () => {
            dispatch(motelActions.setFilter({
                _page: 1,
                _limit: 15,
            }))
        }
    }, [])

    const handleSelectPagination = (e: ChangeEvent<unknown>, page: number) => {
        dispatch(motelActions.setFilter({ ...filter, _page: page }))
    }

    const handleFilterMotel = (e: ChangeEvent<{}>, value: (string | School)[]) => {
        setFilterSchool(value)

        // @ts-ignore
        let _school: any = value.map(school => school.codeName)

        dispatch(motelActions.setFilter({ ...filter, _page: 1, _school }))
    }

    return (
        <MainLayout>
            <Box
                className="container"
                mt={12}
            >
                <ListMotelSection
                    handleSelectPagination={handleSelectPagination}
                    filterSchool={filterSchool}
                    handleFilterMotel={handleFilterMotel}
                />
            </Box>
        </MainLayout>
    )
}

export default MotelPage
