import { Container, makeStyles } from '@material-ui/core';
import axiosClient from 'api/axiosClient';
import { useAppDispatch } from 'app/hooks';
import axios from 'axios';
import { Response } from 'models';
import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authActions } from './authSlice';
import AddiRegister from './components/AddiRegister';
import ForgotPasswork from './components/ForgotPasswork';
import FormLogin from './components/FormLogin';
import FormRegister from './components/FormRegister';
import ResetPassword from './components/ResetPassword';
import { AddiRegisterData, ForgotPasswordData, LoginData, RegisterData } from './models';

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
    const [isLoginGG, setIsLoginGG] = useState(false)

    const [tokenGG, setTokenGG] = useState(null)
    const [tokenFB, setTokenFB] = useState<any>(null)

    //hanlde login with Google
    const onSuccesGG = (res: any) => {
        if (res) {
            const tokenId = res.tokenId;
            setTokenGG(tokenId)

            axiosClient.post('/login-google', {
                tokenId
            }).then((response: Response<any>) => {
                if (response.success === false) {
                    history.push('/auth/additional')
                }
                else {
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
                }
            }).catch((err: any) => {
                console.log('Loi xay ra trong qua trinh dang nhap GG', err.message);
            })

            setIsLoginGG(true)
            history.push('/auth/additional')
        }
    }

    //hanlde login with Facebook
    const onSuccesFB = (res: any) => {
        if (res) {
            const { accessToken, userID } = res?.authResponse;
            setTokenFB({
                accessToken,
                userID
            })

            axiosClient.post('/login-facebook', {
                accessToken,
                userID
            }).then((response: Response<any>) => {
                if (response.success === false) {
                    history.push('/auth/additional')
                }
                else {
                    dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
                }
            }).catch((err: any) => {
                console.log('Loi xay ra trong qua trinh dang nhap GG', err.message);
            })

            setIsLoginGG(false)
            history.push('/auth/additional')
        }
    }

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
            catch (err: any) {
                console.log('Can not upload avatar', err.message);
            }
        }

        try {
            await axiosClient.post('/register', data)
            history.push('/auth/login');
        }
        catch (err: any) {
            console.log("Can not register account", err.message);
        }
    }

    const handleSubmitForgotPassword = async (data: ForgotPasswordData) => {
        try {
            await axiosClient.post('/forgot-password', data)
            toast.success("Mã xác nhận đã được gửi đến email của bạn!!!")
        }
        catch (err: any) {
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

    //additional data for login by FB, GG
    const handleAddiRegister = async (data: AddiRegisterData) => {
        const response: Response<any> = isLoginGG ?
            await axiosClient.post('/register-google', {
                tokenId: tokenGG,
                ...data
            })
            : await axiosClient.post('/register-facebook', {
                ...tokenFB,
                ...data
            })

        dispatch(authActions.login({ username: '', password: '', rememberMe: true, accessToken: response.data.accessToken }));
    }

    return (
        <Container className={classes.root}>
            <Switch>
                <Route path='/auth/login'>
                    <FormLogin onSubmit={handleSubmitLogin} onSuccessGG={onSuccesGG} onSuccessFB={onSuccesFB} setRememberMe={setRememberMe} />
                </Route>

                <Route path="/auth/register">
                    <FormRegister onSubmit={handleSubmitRegister} onChange={handleUploadAvatar} />
                </Route>

                <Route path="/auth/additional">
                    <AddiRegister onSubmit={handleAddiRegister} isLoginGG={isLoginGG} />
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

