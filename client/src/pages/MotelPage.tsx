import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { ListMotelSection } from 'features/motels/components'
import { motelActions, selectFilterMotel } from 'features/motels/motelSlice'
import { School } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'


const MotelPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterMotel)
    const [filterSchool, setFilterSchool] = useState<(string | School)[]>([])

    useEffect(() => {
        dispatch(motelActions.getMotel({
            ...filter,
            _limit: 10
        }))
    }, [filter])

    const handleSelectPagination = (e: ChangeEvent<unknown>, page: number) => {
        dispatch(motelActions.setFilter({ ...filter, _page: page }))
    }

    const handleFilterMotel = (e: ChangeEvent<{}>, value: (string | School)[]) => {
        setFilterSchool(value)

        // @ts-ignore
        let _school: any = value.map(school => school.codeName)

        dispatch(motelActions.setFilter({ ...filter, _school }))
    }

    return (
        <MainLayout>
            <div className="container">
                <ListMotelSection
                    handleSelectPagination={handleSelectPagination}
                    filterSchool={filterSchool}
                    handleFilterMotel={handleFilterMotel}
                />
            </div>
        </MainLayout>
    )
}

export default MotelPage
