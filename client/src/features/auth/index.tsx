import { Container, makeStyles } from '@material-ui/core';
import axiosClient from 'api/axiosClent';
import { useAppDispatch } from 'app/hooks';
import axios from 'axios';
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
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loadingUploadAvatar, setLoadingUploadAvatar] = useState(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const handleSubmitLogin = (data: LoginData) => {
        dispatch(authActions.login({ ...data, rememberMe }))
    }

    const handleSubmitRegister = (data: RegisterData) => {
        console.log("regis");

    }
    const handleSubmitForgotPassword = async (data: ForgotPasswordData) => {
        try {
            await axiosClient.post('/forgot-password', data)
        }
        catch (err) {
            console.log('This is error in forgot password', err.message);
        }
    }

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? e.target.files : []
        console.log(files);

        const data = new FormData();
        data.append('file', files[0])
        data.append('upload_preset', 'user-avatar')
        setLoadingUploadAvatar(true);
        const dataAvatar = await axios.post('https://api.cloudinary.com/v1_1/kltn/image/upload', data)

        setAvatarUrl(dataAvatar.data.secure_url)
        setLoadingUploadAvatar(false)
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
                    <FormRegister onSubmit={handleSubmitRegister} onChange={handleUploadAvatar} />
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

