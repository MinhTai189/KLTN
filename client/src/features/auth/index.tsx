import { Container, makeStyles } from '@material-ui/core';
import { useAppDispatch } from 'app/hooks';
import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { authActions } from './authSlice';
import ForgotPasswork from './components/ForgotPasswork';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import ResetPassword from './components/ResetPassword';
import { ForgotPasswordData, LoginData, RegisterData, ResetPasswordData } from './models';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: '100vw',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: "#ccc",
    },
}))

export default function Auth() {
    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const handleSubmitLogin = (data: LoginData) => {
        dispatch(authActions.login({ ...data, rememberMe }))
    }

    const handleSubmitRegister = (data: RegisterData) => {
        console.log('data register', data)
    }
    const handleSubmitForgotPassword = (data: ForgotPasswordData) => {
        console.log('data forgot password', data)
    }

    const handleSubmitResetPassword = (data: ResetPasswordData) => {
        console.log('data reset password', data)
    }

    return (
        <Container className={classes.root}>
            <Switch>
                <Route path='/auth/login'>
                    <FormLogin onSubmit={handleSubmitLogin} setRememberMe={setRememberMe} />
                </Route>

                <Route path="/auth/register">
                    <FormRegister onSubmit={handleSubmitRegister} />
                </Route>

                <Route path="/auth/forgot-password">
                    <ForgotPasswork onSubmit={handleSubmitForgotPassword} />
                </Route>

                <Route path="/auth/reset-password">
                    <ResetPassword onSubmit={handleSubmitResetPassword} />
                </Route>
            </Switch>
        </Container>
    )
}

