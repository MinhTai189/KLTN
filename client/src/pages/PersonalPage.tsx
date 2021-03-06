import { Box, Typography } from '@material-ui/core'
import { userApi } from 'api/user'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { MainLayout } from 'components/Layouts'
import { ProfieDetail } from 'features/profile/components'
import Activities from 'features/profile/components/Activities'
import { ActivitiesInYears } from 'features/profile/models/Activity'
import { provinceActions, selectDataProvince } from 'features/province/provinceSlice'
import { ProfileUser } from 'models'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'

const PersonalPage = () => {
    const dispatch = useAppDispatch()
    const { id } = useParams<{ id: string }>()

    const listProvince = useAppSelector(selectDataProvince)
    const [dataUser, setDataUser] = useState<ProfileUser | undefined>()

    const mapActivities: ActivitiesInYears = useMemo(() => {
        if (!dataUser) return {}

        const result = dataUser.done.reduce((obj, activity) => {
            const date = new Date(activity.createdAt)
            const year = date.getFullYear()
            const month = date.getMonth()

            //@ts-ignore
            let activitiesMonth = obj[year] ? obj[year] : new Array(12).fill(null)

            activitiesMonth[month] = activitiesMonth[month] ? [...activitiesMonth[month], activity] : [activity]

            //@ts-ignore
            obj[year] = activitiesMonth

            return obj
        }, {})

        return result
    }, [dataUser])

    const init = useCallback(() => {
        userApi.getUserById(id)
            .then(res => setDataUser(res.data))
            .catch(err => {
                console.log(err)
            })
    }, [id])

    useEffect(() => {
        if (listProvince.length === 0)
            dispatch(provinceActions.getAll())

        init()
    }, [id, dispatch, init, listProvince.length])

    return (
        <MainLayout>
            {dataUser && <ProfieDetail
                user={dataUser}
                init={init}
            />}

            <Box className='container' display='flex' justifyContent='center' mt={2}>
                {Object.keys(mapActivities).length > 0 ?
                    <Activities activities={mapActivities} />
                    : <Typography>
                        T??i kho???n hi???n t???i kh??ng c?? b???t k?? ho???t ?????ng n??o
                    </Typography>
                }
            </Box>
        </MainLayout>
    )
}

export default PersonalPage
