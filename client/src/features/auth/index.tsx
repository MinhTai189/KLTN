import { Container, makeStyles } from '@material-ui/core';
import axiosClient from 'api/axiosClient';
import { useAppDispatch } from 'app/hooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authActions } from './authSlice';
import ForgotPasswork from './components/ForgotPasswork';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import ResetPassword from './components/ResetPassword';
import { ForgotPasswordData, LoginData, RegisterData } from './models';
import { useGoogleLogin } from 'react-google-login'
import useFacebook from "react-easy-facebook";

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
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [formAvatar, setFormAvatar] = useState<FormData>();
    const [rememberMe, setRememberMe] = useState<boolean>(false)

    const onSuccess = (res: any) => {
        console.log('da dang nhap gg', res);
    }

    const onFailure = (res: any) => {
        console.log('da dang nhap gg fa', res);
    }

    const { signIn } = useGoogleLogin({
        clientId: '643013812637-sjj5ejfidpkjk93pt9l4t3qleplnof1m.apps.googleusercontent.com',
        onSuccess: onSuccess,
        onFailure
    })

    const { response, login } = useFacebook({
        appId: "985420175361023",
    });

    useEffect(() => {
        response && console.log(response);

    }, [response])

    const handleSubmitLogin = (data: LoginData) => {
        dispatch(authActions.login({ ...data, rememberMe }))
    }

    const handleSubmitRegister = async (data: RegisterData) => {
        if (!formAvatar) {
            data.avatarUrl = '../../assets/images/avatar-default.jpg';
        }
        else {
            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/kltn/image/upload', formAvatar)
                data.avatarUrl = response.data.secure_url
            }
            catch (err) {
                console.log('Can not upload avatar', err.message);
            }
        }

        try {
            await axiosClient.post('/register', data)
            history.push('/auth/login');
        }
        catch (err) {
            console.log("Can not register account", err.message);
        }
    }

    const handleSubmitForgotPassword = async (data: ForgotPasswordData) => {
        try {
            await axiosClient.post('/forgot-password', data)
            toast.success("Mã xác nhận đã được gửi đến email của bạn!!!")
        }
        catch (err) {
            console.log('This is error in forgot password', err.message);
            toast.error("Gửi mail thất bại!!!")
        }
    }

    const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? e.target.files : []

        const form = new FormData();
        form.append('file', files[0])
        form.append('upload_preset', 'user-avatar')
        setFormAvatar(form)
    }

    return (
        <Container className={classes.root}>
            <Switch>
                <Route path='/auth/login'>
                    <FormLogin onSubmit={handleSubmitLogin} signinGG={signIn} signinFB={login} setRememberMe={setRememberMe} />
                </Route>

                <Route path="/auth/register">
                    <FormRegister onSubmit={handleSubmitRegister} onChange={handleUploadAvatar} />
                </Route>

                <Route path="/auth/forgot-password">
                    <ForgotPasswork onSubmit={handleSubmitForgotPassword} />
                </Route>

                <Route path="/auth/reset-password/:token">
                    <ResetPassword />
                </Route>
            </Switch>
        </Container>
    )
}

