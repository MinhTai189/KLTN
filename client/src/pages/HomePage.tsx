import { motelApi } from 'api/motel';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Hero } from 'components/Home';
import { MainLayout } from 'components/Layouts/MainLayout';
import { CommunicateSection } from 'features/communicate/components';
import { selectDataThread, threadActions } from 'features/communicate/threadSlice';
import { ListMotel } from 'features/motels/components';
import { motelActions } from 'features/motels/motelSlice';
import { postAction } from 'features/posts/postSlice';
import { DropdownList } from 'models';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const dispatch = useAppDispatch();

    const listThread = useAppSelector(selectDataThread)
    const [isChangeNav, setIsChangeNav] = useState(false)
    const [listSchoolDropdown, setListSchoolDropdow] = useState<DropdownList[]>([])

    const [hiddenScrollDown, setHiddenScrollDown] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // scroll window event for nav
        window.onscroll = () => {
            if (window.scrollY >= 90) {
                setIsChangeNav(true)
                setHiddenScrollDown(true)
            } else {
                window.scrollY === 0 && setIsChangeNav(false)
                setHiddenScrollDown(false)
            }
        }

        //fetch motel data
        dispatch(motelActions.getMotelRandom({
            _page: 1,
            _limit: 6
        }))

        //get list of school for hero dropdown
        setLoading(true)
        motelApi.getListSchoolDropdown()
            .then(res => {
                setLoading(false)
                setListSchoolDropdow(res.data)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })

        // get list of thread
        !listThread && dispatch(threadActions.get())

        //get list recent post
        dispatch(postAction.get({
            _page: 1,
            _limit: 6,
            _sort: 'createdat',
            _order: 'desc'
        }))

        return () => {
            window.onscroll = () => { }
        }
    }, [dispatch, listThread])

    return (
        <MainLayout isChangeNav={isChangeNav}>
            <Hero
                hiddenScrollDown={hiddenScrollDown}
                listSchool={listSchoolDropdown}
                loading={loading}
            />

            <ListMotel />

            <CommunicateSection />
            {/* find motel */}
            {/* forum */}
        </MainLayout>
    )
}

export default HomePage
