import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts/MainLayout'
import { ListMotelSection } from 'features/motels/components'
import { motelActions, selectFilterMotel } from 'features/motels/motelSlice'
import { schoolActions, selectDataSchool } from 'features/school/schoolSlice'
import { School } from 'models'
import { ChangeEvent, useEffect, useState } from 'react'


const MotelPage = () => {
    const dispatch = useAppDispatch()
    const filter = useAppSelector(selectFilterMotel)
    const listSchool = useAppSelector(selectDataSchool)

    const [filterSchool, setFilterSchool] = useState<(string | School)[]>(() => {
        if (!filter._school)
            return []

        const _school = listSchool.filter(x => (filter._school as string[]).includes(x.codeName))
        return _school
    })

    useEffect(() => {
        dispatch(motelActions.getMotel({
            ...filter,
            _limit: 10,
        }))
    }, [filter])

    useEffect(() => {
        if (listSchool.length === 0)
            dispatch(schoolActions.getSchool())
    }, [])

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
