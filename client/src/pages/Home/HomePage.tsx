import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Header } from 'components/Common';
import { Hero } from 'components/Home';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { ListMotel } from 'features/motels/components';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const isLogged = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();
    const [isChangeNav, setIsChangeNav] = useState(false)

    useEffect(() => {
        function autoLogin() {
            if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
                dispatch(authActions.login({ username: '', password: '', rememberMe: true }))
            }
        }
        autoLogin();
    }, [dispatch, isLogged])

    useEffect(() => {
        // scroll event window for nav
        window.addEventListener('scroll', () => {
            window.scrollY >= 90 ? setIsChangeNav(true) : window.scrollY === 0 && setIsChangeNav(false)
        })

        return () => {
            window.removeEventListener('scroll', () => { })
        }
    }, [])

    return (
        <>
            <Header isChangeNav={isChangeNav} />
            <Hero />
            <ListMotel />
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            {/* find motel */}
            {/* forum */}
        </>
    )
}

export default HomePage
