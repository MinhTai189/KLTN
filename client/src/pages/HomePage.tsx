import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Header } from 'components/Common';
import { Hero } from 'components/Home';
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
        dispatch(motelActions.getMotel({
            _page: 1,
            _limit: 6
        }))
    }, [filter])

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
        <>
            <Header isChangeNav={isChangeNav} />
            <Hero hiddenScrollDown={hiddenScrollDown} />
            <ListMotel />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {/* find motel */}
            {/* forum */}
        </>
    )
}

export default HomePage
