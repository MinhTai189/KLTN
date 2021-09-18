import { Container } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Header } from 'components/Common';
import { Hero } from 'components/Home';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { useEffect } from 'react';

export const HomeLayout = () => {
    const isLogged = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();

    useEffect(() => {
        function autoLogin() {
            if (!isLogged && Boolean(localStorage.getItem('accessToken'))) {
                dispatch(authActions.login({ username: '', password: '', rememberMe: true }))
            }
        }
        autoLogin();
    }, [dispatch, isLogged])

    return (
        <>
            {/* <Header /> */}
            <Hero />
            {/* list motel */}
            {/* find motel */}
            {/* forum */}
        </>
    )
}
