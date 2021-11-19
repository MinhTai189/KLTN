import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Hero } from 'components/Home';
import { MainLayout } from 'components/Layouts/MainLayout';
import { selectIsLogged } from 'features/auth/authSlice';
import { CommunicateSection } from 'features/communicate/components';
import { selectDataThread, threadActions } from 'features/communicate/threadSlice';
import { ListMotel } from 'features/motels/components';
import { motelActions } from 'features/motels/motelSlice';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const filter = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();

    const listThread = useAppSelector(selectDataThread)
    const [isChangeNav, setIsChangeNav] = useState(false)
    const [hiddenScrollDown, setHiddenScrollDown] = useState(false)

    useEffect(() => {
        //fetch motel data
        dispatch(motelActions.getMotelRandom({
            _page: 1,
            _limit: 6
        }))
    }, [filter, dispatch])

    useEffect(() => {
        // scroll event window for nav
        window.onscroll = () => {
            if (window.scrollY >= 90) {
                setIsChangeNav(true)
                setHiddenScrollDown(true)
            } else {
                window.scrollY === 0 && setIsChangeNav(false)
                setHiddenScrollDown(false)
            }
        }

        // get list of thread
        !listThread && dispatch(threadActions.get())

        return () => {
            window.onscroll = () => { }
        }
    }, [])

    return (
        <MainLayout isChangeNav={isChangeNav}>
            <Hero hiddenScrollDown={hiddenScrollDown} />

            <ListMotel />

            <CommunicateSection />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {/* find motel */}
            {/* forum */}
        </MainLayout>
    )
}

export default HomePage
