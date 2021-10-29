import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Hero } from 'components/Home';
import { MainLayout } from 'components/Layouts/MainLayout';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { ListMotel } from 'features/motels/components';
import { motelActions } from 'features/motels/motelSlice';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const isLogged = useAppSelector(selectIsLogged)
    const filter = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();

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

        return () => {
            window.onscroll = () => { }
        }
    }, [])

    return (
        <MainLayout isChangeNav={isChangeNav}>
            <Hero hiddenScrollDown={hiddenScrollDown} />

            <ListMotel />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {/* find motel */}
            {/* forum */}
        </MainLayout>
    )
}

export default HomePage
