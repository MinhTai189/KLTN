import threadApi from 'api/thread';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Hero } from 'components/Home';
import { MainLayout } from 'components/Layouts/MainLayout';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { CommunicateSection } from 'features/communicate/components';
import { ListMotel } from 'features/motels/components';
import { motelActions } from 'features/motels/motelSlice';
import { Thread } from 'models/Thread';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const isLogged = useAppSelector(selectIsLogged)
    const filter = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();

    const [listThread, setListThread] = useState<Array<Thread>>([])
    const [isChangeNav, setIsChangeNav] = useState(false)
    const [hiddenScrollDown, setHiddenScrollDown] = useState(false)

    useEffect(() => {
        function autoLogin() {
            if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
                dispatch(authActions.login({ username: '', password: '', rememberMe: true }))
            }
        }
        autoLogin();
    }, [dispatch, isLogged])

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
        threadApi.get()
            .then(res => setListThread(res.data))
            .catch(err => console.log(err?.message))

        return () => {
            window.onscroll = () => { }
        }
    }, [])

    return (
        <MainLayout isChangeNav={isChangeNav}>
            <Hero hiddenScrollDown={hiddenScrollDown} />

            <ListMotel />

            {listThread.length > 0 && <CommunicateSection listThread={listThread} />}
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {/* find motel */}
            {/* forum */}
        </MainLayout>
    )
}

export default HomePage
