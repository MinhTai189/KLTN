import { userApi } from 'api/user'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts'
import { ProfieDetail } from 'features/profile/components'
import { provinceActions, selectDataProvince } from 'features/province/provinceSlice'
import { ProfileUser } from 'models'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

const PersonalPage = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>()

    const listProvince = useAppSelector(selectDataProvince)
    const [dataUser, setDataUser] = useState<ProfileUser | undefined>()

    useEffect(() => {
        if (listProvince.length === 0)
            dispatch(provinceActions.getAll())

        init()
    }, [])

    function init() {
        userApi.getUserById(id)
            .then(res => setDataUser(res.data))
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <MainLayout>
            {dataUser && <ProfieDetail
                user={dataUser}
                init={init}
            />}
        </MainLayout>
    )
}

export default PersonalPage
