import { Container } from '@material-ui/core';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Header } from 'components/Common';
import { authActions, selectIsLogged } from 'features/auth/authSlice';
import { useEffect } from 'react';

export const HomeLayout = () => {
    const isLogged = useAppSelector(selectIsLogged)
    const dispatch = useAppDispatch();

    useEffect(() => {
        function autoLogin() {
            if (!isLogged) {
                dispatch(authActions.login({ username: '', password: '', rememberMe: true }))
            }
        }
        autoLogin();
    }, [])

    return (
        <>
            <Header />

            <Container>
                {/* list motel */}
                {/* find motel */}
                {/* forum */}
            </Container>
        </>
    )
}
